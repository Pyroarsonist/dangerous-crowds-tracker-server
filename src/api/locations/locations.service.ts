import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserLocationModel, UserModel } from 'common/database/models';
import { PointInterface } from 'common/database/interfaces';
import sequelize, { Op } from 'sequelize';
import moment from 'moment';
import { GetLocationsResponseDto } from 'api/locations/dtos/responses';
import { StatusEnum } from 'api/locations/enums';

@Injectable()
export class LocationsService {
  private readonly MAXIMUM_UPDATE_AT_INTERVAL = 30; // 30 minutes
  private readonly RADIUS = 2000; // 2000 meters
  private readonly MAXIMUM_OK_DISTANCE = 5; // 5 meters
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
  ): Promise<GetLocationsResponseDto> {
    const locations = await this.getLocationsInCircle(id, latitude, longitude);
    const status = this.resolveHealthStatus(locations);
    return {
      status,
      locations: locations.map((l) => {
        const [longitude, latitude] = l.point.coordinates;
        return {
          latitude,
          longitude,
        };
      }),
    };
  }

  private async getLocationsInCircle(
    id: number,
    latitude: number,
    longitude: number,
  ): Promise<UserLocationModel[]> {
    const distanceAttribute = sequelize.fn(
      'ST_Distancesphere',
      sequelize.literal('point'),
      sequelize.literal(`ST_MakePoint(${longitude},${latitude})`),
    );

    const locations = await this.userLocationModel.findAll({
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
          [Op.lte]: this.RADIUS,
        }),
      ],
      order: [[sequelize.literal('distance'), 'ASC']],
      include: [UserLocationModel.associations.user],
    });

    return locations;
  }

  private resolveHealthStatus(locations: UserLocationModel[]): StatusEnum {
    //todo: refactor

    // console.log(locations[0].getDataValue('distance'));
    const distances = locations.map((l) => l.getDataValue('distance'));
    // console.log(distances);
    if (!distances.length) {
      return StatusEnum.GOOD;
    }

    if (distances.some((d) => d < this.MAXIMUM_OK_DISTANCE)) {
      return StatusEnum.BAD;
    }

    return StatusEnum.OK;
  }
}
