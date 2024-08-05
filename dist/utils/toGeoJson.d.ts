type WKTProp = {
    id: number;
    name?: string;
    geo?: {
        x: number;
        y: number;
    };
    [key: string]: any;
};
type GeoJSONFeature = {
    type: string;
    properties: {
        name?: string;
        center?: [number, number];
        adcode?: number;
    };
    geometry: {
        type: string;
        coordinates: any[];
    };
};
export declare const WKTList2GeoJSON: (wktList: WKTProp[]) => {
    type: string;
    features: GeoJSONFeature[];
};
export declare const WKT2Feature: (prop: WKTProp, wkt: string) => GeoJSONFeature;
export declare const parsePolygon: (polygon: string) => number[][][];
export declare const GeoUnZip: (base64: string) => number[][];
export declare const GeoUnZipBytes: (bytes: string) => number[][];
export declare const _GeoUnZip: (refOut: [string, number], prev: number, mark: number, markLen: number) => number;
export {};
//# sourceMappingURL=toGeoJson.d.ts.map