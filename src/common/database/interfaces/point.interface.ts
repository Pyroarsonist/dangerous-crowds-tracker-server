export interface PointInterface {
  crs?: {
    type: string;
    properties: {
      name: string;
    };
  };

  type: string;

  // longitude, latitude
  coordinates: [number, number];
}
