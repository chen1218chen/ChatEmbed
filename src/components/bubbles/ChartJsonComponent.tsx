import { onMount } from 'solid-js';
import * as echarts from 'echarts';
import _ from 'lodash';
import { sendRequest } from '@/utils/index';
import chainMap from '../../assets/mapjson/china.json';
type Props = {
  data: string;
};
const map: any = chainMap;
export const ChartJsonComponent = (props: Props) => {
  let chartRef: HTMLDivElement | undefined;
  let chart: any;

  // createEffect(() => {
  //   if (chartRef) {
  //     if (chart) {
  //       chart.dispose();
  //     }
  //     chart = echarts.init(chartRef);
  //     let data = JSON.parse(props.data);
  //     chart.setOption(data);
  //   }
  // }, [props.data]);

  onMount(() => {
    const data = props.data;
    const optionsData = JSON.parse(data);

    if (_.includes(data, 'map') || _.includes(data, 'geo') || _.includes(data, 'mapType')) {
      if (_.includes(data, 'mapType')) {
        if (optionsData && optionsData.series) {
          // const lastType = _.last(_.map(data, 'mapType'))
          const lastType = _.get(_.last(optionsData.series), 'mapType');
          const showType = _.get(_.last(optionsData.series), 'type');

          if (lastType && showType === 'map') {
            if (lastType === 'china') {
              echarts.registerMap('china', map);
            }
            fetchData(lastType).then((res) => {
              if (res) {
                getGeoJsonData(res).then((geoJson: any) => {
                  try {
                    if (geoJson) {
                      echarts.registerMap(lastType, geoJson);
                    }
                  } catch (error) {
                    console.log('error', error);
                  }
                });
              }
            });
          }
        }
      }
    }
    chart = echarts.init(chartRef);
    chart.setOption(optionsData);
    // window.addEventListener("resize", () => chart?.resize())
  });

  const fetchData = async (cityName: string) => {
    let cityCode = null;

    const response = await sendRequest({
      url: 'https://restapi.amap.com/v3/config/district',
      method: 'GET',
      body: {
        key: '2ea647be48d23196257bb83c5b08da54',
        keywords: cityName,
        subdistrict: 0,
      },
    });
    if (response.data) {
      // 在这里处理返回的数据
      const data: any = response.data;
      const districts = data.districts;
      if (districts && districts.length > 0) {
        for (let i = 0; i < districts.length; i++) {
          if (districts[i].adcode) {
            cityCode = districts[i].adcode;
          }
        }
      }
    }

    return cityCode;
  };

  const getGeoJsonData = async (adcode: string) => {
    let geoJsonData = null;

    const result = await sendRequest({
      url: `https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=${adcode}_full`,
      method: 'GET',
    });
    if (result.data) {
      geoJsonData = result.data;
    }

    return geoJsonData;
  };

  return <div ref={chartRef} style={{ width: '100%', height: '400px', 'margin-top': '20px' }} id="echarts" />;
};
