import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CoronavirusDayInterface } from 'common/coronavirus/interfaces';

@Injectable()
export class CoronavirusService {
  private readonly logger = new Logger(CoronavirusService.name);
  private readonly apiUrl = 'https://api.covid19api.com/dayone/country/ukraine';

  private snapshot: CoronavirusDayInterface[] = null;

  constructor(private httpService: HttpService) {}

  private async onModuleInit(): Promise<void> {
    await this.fetchData();
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  private async fetchData(): Promise<void> {
    try {
      const { data } = await this.httpService
        .get<CoronavirusDayInterface[]>(this.apiUrl)
        .toPromise();
      this.snapshot = data;
    } catch (e) {
      this.logger.error(e, e.stack);
    }
  }

  public getSnapshot(): CoronavirusDayInterface[] {
    return this.snapshot;
  }
}
