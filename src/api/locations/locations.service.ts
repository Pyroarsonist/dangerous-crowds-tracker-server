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
import { HealthStatusEnum } from 'common/database/enums';

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
    const locations = await this.getLocationsInCircle(
      id,
      latitude,
      longitude,
      radius,
    );
    const { status, points } = this.calculateHealthStatusAndPoints(locations);
    return {
      status,
      locations: locations.map((l) => {
        const [longitude, latitude] = l.point.coordinates;
        return {
          latitude,
          longitude,
        };
      }),
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

  private statusCoefficient(status: HealthStatusEnum): number {
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

  private getLocationPoints(
    distance: number,
    status = HealthStatusEnum.UNKNOWN,
  ): number {
    const k = this.statusCoefficient(status);

    return Math.ceil(this.FORMULA_CONSTANT * (k / distance));
  }

  private calculateHealthStatusAndPoints(
    locations: UserLocationModel[],
  ): { status: CrowdStatusEnum; points: number } {
    const data: {
      distance: number;
      status: HealthStatusEnum;
    }[] = locations.map((location) => ({
      distance: location.getDataValue('distance'),
      status: location?.user?.status?.status,
    }));

    const pointSum = data.reduce(
      (acc, d) => acc + this.getLocationPoints(d.distance, d.status),
      0,
    );

    if (pointSum > this.POINTS_LIMITS.BAD) {
      return { status: CrowdStatusEnum.BAD, points: pointSum };
    }
    if (pointSum > this.POINTS_LIMITS.OK) {
      return { status: CrowdStatusEnum.OK, points: pointSum };
    }

    return { status: CrowdStatusEnum.GOOD, points: pointSum };
  }
}
