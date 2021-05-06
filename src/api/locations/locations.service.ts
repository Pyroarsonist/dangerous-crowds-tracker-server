import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  UserHealthIndicatorModel,
  UserLocationModel,
  UserModel,
} from 'common/database/models';
import { PointInterface } from 'common/database/interfaces';
import sequelize, { Op } from 'sequelize';
import moment from 'moment';
import { GetLocationsResponseDto } from 'api/locations/dtos/responses';
import { CrowdStatusEnum } from 'api/locations/enums';
import { HealthStatusEnum, SexEnum } from 'common/database/enums';
import { LocationInterface } from 'api/locations/interfaces';

@Injectable()
export class LocationsService {
  public static readonly MAX_RADIUS = 5000; // 5000 meters
  private readonly MAXIMUM_UPDATE_AT_INTERVAL = 30; // 30 minutes
  private readonly FORMULA_CONSTANT = 50;
  private readonly STATUS_COEFFICIENTS = {
    UNKNOWN: 10,
    INFECTED: 30,
    RECOVERED: 0.5,
    VACCINATED: 0.01,
  };
  private readonly POINTS_LIMITS = {
    BAD: 140,
    OK: 50,
  };

  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    @InjectModel(UserLocationModel)
    private readonly userLocationModel: typeof UserLocationModel,
  ) {}

  public async saveLocation(
    userId: number,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    const point: PointInterface = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    await this.userLocationModel.upsert({ userId, point });
  }

  public async getLocations(
    id: number,
    latitude: number,
    longitude: number,
    _radius?: number,
  ): Promise<GetLocationsResponseDto> {
    const radius = _radius ?? LocationsService.MAX_RADIUS;
    const _locations = await this.getLocationsInCircle(
      id,
      latitude,
      longitude,
      radius,
    );
    const { status, points, locations } = this.calculateHealthStatusAndPoints(
      _locations,
    );
    return {
      status,
      locations,
      radius,
      points,
    };
  }

  private async getLocationsInCircle(
    id: number,
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<UserLocationModel[]> {
    const distanceAttribute = sequelize.fn(
      'ST_Distancesphere',
      sequelize.literal('point'),
      sequelize.literal(`ST_MakePoint(${longitude},${latitude})`),
    );

    return this.userLocationModel.findAll({
      attributes: [
        ...Object.keys(UserLocationModel.rawAttributes),
        [distanceAttribute, 'distance'],
      ],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      where: [
        {
          userId: {
            [Op.not]: id,
          },
        },
        {
          updatedAt: {
            [Op.gte]: moment().subtract(this.MAXIMUM_UPDATE_AT_INTERVAL, 'm'),
          },
        },
        sequelize.where(distanceAttribute, {
          [Op.lte]: radius,
        }),
      ],
      order: [[sequelize.literal('distance'), 'ASC']],
      include: [
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          model: UserModel,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          include: [UserHealthIndicatorModel],
        },
      ],
    });
  }

  private medCoefficient(status: HealthStatusEnum): number {
    if (status === HealthStatusEnum.INFECTED) {
      return this.STATUS_COEFFICIENTS.INFECTED;
    }
    if (status === HealthStatusEnum.RECOVERED) {
      return this.STATUS_COEFFICIENTS.RECOVERED;
    }
    if (status === HealthStatusEnum.VACCINATED) {
      return this.STATUS_COEFFICIENTS.VACCINATED;
    }

    return this.STATUS_COEFFICIENTS.UNKNOWN;
  }

  private ageCoefficient(age: number) {
    // 100 y.o. - 1.2 coefficient
    // 20 y.o. - 1 coefficient
    return 0.002 * age + 0.95;
  }

  private sexCoefficient(sex: SexEnum) {
    if (sex === SexEnum.MALE) {
      return 1.2;
    }
    return 1;
  }

  private getLocationPoints(
    distance: number,
    status,
    sex: SexEnum,
    age: number,
  ): number {
    const kMed = this.medCoefficient(status);
    const kSex = this.sexCoefficient(sex);
    const kAge = this.ageCoefficient(age);

    return Math.ceil(this.FORMULA_CONSTANT * (kMed / distance) * kAge * kSex);
  }

  private getHealthStatus(pointSum: number): CrowdStatusEnum {
    if (pointSum > this.POINTS_LIMITS.BAD) {
      return CrowdStatusEnum.BAD;
    }
    if (pointSum > this.POINTS_LIMITS.OK) {
      return CrowdStatusEnum.OK;
    }

    return CrowdStatusEnum.GOOD;
  }

  private calculateHealthStatusAndPoints(
    _locations: UserLocationModel[],
  ): {
    status: CrowdStatusEnum;
    points: number;
    locations: LocationInterface[];
  } {
    const locations: LocationInterface[] = _locations
      .map((location) => {
        const [longitude, latitude] = location.point.coordinates;
        return {
          distance: location.getDataValue('distance'),
          status: location.user.status?.status || HealthStatusEnum.UNKNOWN,
          sex: location.user.sex,
          age: moment().diff(moment(location.user.birthDate), 'years'),
          latitude,
          longitude,
        };
      })
      .map((l) => ({
        ...l,
        points: this.getLocationPoints(l.distance, l.status, l.sex, l.age),
      }));

    const pointSum = locations.reduce((acc, l) => acc + l.points, 0);

    const status = this.getHealthStatus(pointSum);

    return {
      status,
      points: pointSum,
      locations: locations.map((l) => ({
        points: l.points,
        distance: l.distance,
        latitude: l.latitude,
        longitude: l.longitude,
      })),
    };
  }
}
