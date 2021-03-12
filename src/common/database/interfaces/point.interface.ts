export interface PointInterface {
  crs?: {
    type: string;
    properties: {
      name: string;
    };
  };

  type: string;

  coordinates: [number, number];
}
