type WKTProp = {
    id: number;
    name?: string;
    geo?: { x: number; y: number };
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

export const WKTList2GeoJSON = (wktList: WKTProp[]): { type: string; features: GeoJSONFeature[] } => {
    const Polygon4603Hide = false;
    const features: GeoJSONFeature[] = [];
    const geoJson = { type: 'FeatureCollection', features: features };

    for (let i = 0; i < wktList.length; i++) {
        const item = wktList[i];
        if (item.id === 4603 && Polygon4603Hide) {
            //三沙市特殊处理
            continue;
        }
        features.push(WKT2Feature(item, item.polygon));
    }
    return geoJson;
};

/* 将wkt字符串转成geojson Feature元素
 * prop: {
 *   id: 123,
 *   name: "武汉",
 *   其他属性
 * }
 * wkt: "POLYGON((...))", "MULTIPOLYGON(((...)),((...)))", "EMPTY"
 */
export const WKT2Feature = (prop: WKTProp, wkt: string): GeoJSONFeature => {
    const Polygon4603Hide = false;
    const feature: GeoJSONFeature = {
        type: 'Feature',
        properties: {
            name: prop?.name,
            center: prop?.geo ? [prop.geo.x, prop.geo.y] : undefined,
            adcode: prop?.id,
        },
        geometry: {
            type: 'Polygon',
            coordinates: [],
        },
    };
    const geometry = feature.geometry;

    if (wkt?.indexOf('EMPTY') !== -1) {
        // NOOP
    } else if (wkt?.indexOf('POLYGON') === 0) {
        geometry.coordinates = parsePolygon(wkt.replace(/^POLYGON\s*\(\(|\)\)$/gi, ''));
    } else if (wkt?.indexOf('MULTIPOLYGON') === 0) {
        geometry.type = 'MultiPolygon';
        const ps = wkt.replace(/^MULTIPOLYGON\s*\(\(\(|\)\)\)$/gi, '').split(/\)\)\s*,\s*\(\(/g);
        let maxIdx = 0;
        let max = 0;
        for (let i2 = 0; i2 < ps.length; i2++) {
            const arr = parsePolygon(ps[i2]);
            if (arr[0].length > max) {
                max = arr[0].length;
                maxIdx = i2;
            }
            geometry.coordinates.push(arr);
        }
        if (prop.id === 46 && Polygon4603Hide) {
            //海南省界特殊处理
            geometry.coordinates = [geometry.coordinates[maxIdx]];
        }
    }
    return feature;
};

export const parsePolygon = (polygon: string): number[][][] => {
    const isZip = polygon.substr(0, 2) === 'Z:'; //GeoZip压缩过
    const arr = polygon.split(/\)\s*,\s*\(/g);
    const vals: number[][][] = [];
    for (let i = 0, l = arr.length; i < l; i++) {
        if (isZip) {
            //压缩过，解压即可
            vals.push(GeoUnZip(arr[i]));
        } else {
            //普通的wkt
            const ps = arr[i].split(/\s*,\s*/g);
            const pos: number[][] = [];
            for (let j = 0, jl = ps.length; j < jl; j++) {
                const v = ps[j].split(' ');
                pos.push([+v[0], +v[1]]);
            }
            vals.push(pos);
        }
    }
    return vals;
};

export const GeoUnZip = (base64: string): number[][] => {
    const bytes = atob(base64.substr(2));
    return GeoUnZipBytes(bytes);
};

/* 二进制（ASCII字符串）边界坐标解压，返回坐标数组 */
export const GeoUnZipBytes = (bytes: string): number[][] => {
    const rtv: number[][] = [];
    if (!bytes) {
        return rtv;
    }
    const Zip_Scale=1000000
    //先提取出第一个坐标
    let x = '';
    let y = '';
    let isY = 0;
    for (let i = 0; i < bytes.length; i++) {
        const chr = bytes.charAt(i);
        if (chr === ':') {
            i++;
            break;
        }
        if (chr === ' ') {
            isY = 1;
        } else if (isY) {
            y += chr;
        } else {
            x += chr;
        }
    }
    let xNum = +x;
    let yNum = +y;
    rtv.push([xNum / Zip_Scale, yNum / Zip_Scale]);

    //继续，连续解码
    let markLen = 4;
    let mark = 0;
    const refOut: [string, number] = [bytes, 0]; //有些语言字符串传参会复制新字符串
    for (let i = refOut[1]; i < bytes.length; i++) {
        if (markLen === 4) {
            //提取出符号+溢出标识字节
            markLen = 0;
            mark = bytes.charCodeAt(i);
            continue;
        }
        refOut[1] = i;
        xNum = _GeoUnZip(refOut, xNum, mark, markLen++);
        yNum = _GeoUnZip(refOut, yNum, mark, markLen++);
        i = refOut[1] - 1;

        rtv.push([xNum / Zip_Scale, yNum / Zip_Scale]);
    }
    return rtv;
};

export const _GeoUnZip = (refOut: [string, number], prev: number, mark: number, markLen: number): number => {
    let i = refOut[1];
    mark = mark >> (markLen * 2);
    const mark0 = mark & 0b1; //符号位
    const mark1 = (mark & 0b10) >> 1; //单字节是否溢出

    let val = refOut[0].charCodeAt(i++);
    if (mark1) {
        //已溢出，需要读取比2字节多用了几个字节0-3
        const more = (val & 0b11000000) >> 6;
        val &= 0b111111;
        val |= refOut[0].charCodeAt(i++) << 6;
        if (more > 0) val |= refOut[0].charCodeAt(i++) << (6 + 8);
        if (more > 1) val |= refOut[0].charCodeAt(i++) << (6 + 16);
    }
    if (mark0) {
        //负数
        val = -val;
    }

    refOut[1] = i;
    return val + prev;
};
