export class StatsDay {
  public readonly date: string;
  public readonly confirmed: number;
  public readonly deaths: number;
  public readonly recovered: number;
  public readonly active: number;
  public readonly id: string;
}
export class StatsResponseDto {
  public readonly days: StatsDay[];
}
