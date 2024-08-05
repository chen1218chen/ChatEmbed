import { createSignal, onMount } from 'solid-js';
import * as echarts from 'echarts';
// import 'echarts-wordcloud'
import _ from 'lodash';
import { sendRequest } from '@/utils/index';
import chainMap from '../../assets/mapjson/china.json';
import { WKTList2GeoJSON } from '@/utils/toGeoJson'
import { getGeoDataApi } from '@/queries/sendMessageQuery';
import chartThemeDark from '../../assets/mapjson/echartDart.json';
import chartTheme from '../../assets/mapjson/echart.json';

// marked-highlight.js 配置
import {marked} from 'marked';
import {markedHighlight} from 'marked-highlight';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css'; // 引入 highlight.js 样式
// import 'highlight.js/styles/github.css'; // 你可以选择你喜欢的样式

// 设置 marked 使用 marked-highlight 插件
// marked.use(
//   markedHighlight({
//     langPrefix: 'hljs language-', // 加上 hljs 的样式前缀
//     highlight: (code: string, lang: string) => {
//       const language = hljs.getLanguage(lang) ? lang : 'plaintext';
//       return hljs.highlight(code, { language }).value;
//     }
//   })
// );
type Props = {
  data: string;
};
const map: any = chainMap;
export const ChartJsonComponent = (props: Props) => {
  let chartRef: HTMLDivElement | undefined;
  let chart: any;
  const [describe, SetDescribe] = createSignal<string>('');
  // console.log(props.data);
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

  onMount(async() => {
    const data = props.data;

    let echartsTheme;
    const optionsData = JSON.parse(data);
    if (optionsData && optionsData.describe) {
        SetDescribe(optionsData.describe)
    }
    if (optionsData && optionsData.theme === 'dark') {
      optionsData.textStyle = {
          color: '#ffffff'
      }
      if (optionsData.title) {
          optionsData.title.textStyle = {
              color: '#ffffff'
          }
      }
      optionsData.xAxis.lineStyle = {
          color: '#ffffff',
          width: 1,
          type: 'solid'
      }
      if (optionsData.visualMap) {
          optionsData.visualMap.textStyle = {
              color: '#ffffff'
          }
      }
      if (optionsData.toolbox && optionsData.toolbox.feature) {
          optionsData.toolbox.iconStyle = {
              color: '#ffffff'
          }
      }
      if (optionsData.legend) {
          optionsData.legend.textStyle = {
              color: '#ffffff'
          }
      }
      // setStyleTheme(oneDark)
      
      // echartsTheme = await import('../../assets/mapjson/echartDart.json')
      echarts.registerTheme('shine', chartThemeDark)
  } else {
      // setStyleTheme(oneLight)
      // echartsTheme = await import('../../assets/mapjson/echart.json')
      echarts.registerTheme('shine', chartTheme)
  }
    if (optionsData && optionsData.series && optionsData.series[0] && optionsData.series[0].data.length > 0) {
                const lastType = _.get(_.last(optionsData.series), 'type')
                if (lastType === 'wordCloud') {
                    optionsData.series[0].shape = 'circle'
                    optionsData.series[0].sizeRange = [10, 30]
                    optionsData.series[0].rotationRange = [-90, 90]
                    optionsData.series[0].rotationStep = 45
                    optionsData.series[0].gridSize = 8
                    optionsData.series[0].drawOutOfBound = true
                    optionsData.series[0].textStyle = {
                        fontFamily: 'sans-serif',
                        fontWeight: 'bold',
                        color: function () {
                            // Random color
                            return (
                                'rgb(' +
                                [Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(
                                    ','
                                ) +
                                ')'
                            )
                        }
                    }
                    optionsData.series[0].emphasis = {
                        focus: 'self',
                        textStyle: {
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    }
                }
                if (
                    lastType !== 'bar' &&
                    lastType !== 'line' &&
                    lastType !== 'scatter' &&
                    lastType !== 'candlestick' &&
                    lastType !== 'boxplot' &&
                    lastType !== 'pictorialBar'
                ) {
                    if (optionsData && optionsData.xAxis) {
                        optionsData.xAxis.show = false
                    }
                    if (optionsData && optionsData.yAxis) {
                        optionsData.yAxis.show = false
                    }
                }
                if (lastType !== 'map') {
                    if (optionsData && optionsData.visualMap) {
                        optionsData.visualMap = null
                    }
                }
                if (lastType !== 'radar') {
                    if (optionsData && optionsData.radar) {
                        optionsData.radar = null
                    }
                }
            }
            if (optionsData && optionsData.series && optionsData.series[0] && optionsData.series[0].data.length > 0) {
                const lastType = _.get(_.last(optionsData.series), 'type')
                if (lastType === 'pie') {
                    if (optionsData.xAxis) {
                        optionsData.xAxis.show = false
                    }
                    const color = [
                        '#63b2ee',
                        '#76da91',
                        '#f8cb7f',
                        '#f89588',
                        '#7cd6cf',
                        '#9192ab',
                        '#7898e1',
                        '#efa666',
                        '#eddd86',
                        '#9987ce',
                        '#21CCFF',
                        '#86DF6C',
                        '#0E42D2',
                        '#FFE700',
                        '#2CD8C5',
                        '#86909C'
                    ]
                    optionsData.color = color
                    console.log('pie optionsData ====>', optionsData)
                }
            }
    if (_.includes(data, 'map') || _.includes(data, 'geo') || _.includes(data, 'mapType')) {
      if (_.includes(data, 'mapType')) {
        if (optionsData && optionsData.series && optionsData.series[0] && optionsData.series[0].data.length > 0) {
          const lastType = _.get(_.last(optionsData.series), 'mapType');
          const showType = _.get(_.last(optionsData.series), 'type');

          if (lastType && showType === 'map') {
            if (lastType === 'china') {
              echarts.registerMap('china', map);
              const chart = echarts.init(chartRef, 'shine')
              chart.setOption(optionsData)
            }else {
              //解决异步的问题，导致地图数据获取不到  使用高德进行地理反编码，进行dataV获取geojson
              // ;(async () => {
              //     const getFetchData = await fetchData(lastType)
              //     if (getFetchData) {
              //         const geoJson = await getGeoJsonData(getFetchData)
              //         if (geoJson) {
              //             echarts.registerMap(lastType, geoJson)
              //             const chart = echarts.init(chartRef.current, 'shine')
              //             chart.setOption(optionsData)
              //         }
              //     }
              // })()

              // 本地服务器获取geoJson,解决地图私有化部署问题
              ;(async () => {
                  const getFetchData = await getGeoDataApi(lastType)
                  if (getFetchData) {
                      const geoJson = await WKTList2GeoJSON(getFetchData.data)
                      if (geoJson) {
                          echarts.registerMap(lastType, geoJson as any)
                          const chart = echarts.init(chartRef, 'shine')
                          chart.setOption(optionsData)
                      }
                  }
              })()
          }
          //同步获取数据
            // fetchData(lastType).then((res) => {
            //   if (res) {
            //     getGeoJsonData(res).then((geoJson: any) => {
            //       try {
            //         if (geoJson) {
            //           echarts.registerMap(lastType, geoJson);
            //         }
            //       } catch (error) {
            //         console.log('error', error);
            //       }
            //     });
            //   }
            // });
          }
        }
      }
    } else {
        // console.log('optionsData====>', optionsData)
        const chart = echarts.init(chartRef, 'shine')
        if (optionsData) {
            chart.setOption(optionsData)
        }
        // chart.setOption(optionsData)
        return () => {
            chart.dispose()
        }
    }
    window.addEventListener("resize", () => chart?.resize())
  });

   // 高亮处理 describe 内容
   const highlightText = (text: string) => {
    try {
      const highlighted = hljs.highlightAuto(text).value;
      return { __html: highlighted };
    } catch (error) {
      console.error('Highlighting error:', error);
      return { __html: text }; // 如果高亮出错，则返回原文本
    }
  };

  // TODO:渲染 describe 的高亮
  const renderDescribe = () => {
    const description = describe();
    if (!description) return null;

    // 使用 `marked` 解析 describe 内容
    const markdown = marked.parse(description) as string;
    return <div innerHTML={markdown} />;
  };
  
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <div ref={chartRef} style={{ width: '100%', height: '400px', 'margin-top': '20px' }} id="echarts" />
      {/* <div innerHTML={highlightText(describe())} /> */}
      {/* {renderDescribe()} */}
      {describe() && describe().length > 0 ? (
        <pre class="language-javascript">
          <code class="language-javascript">{describe()}</code>
        </pre>
      ) : null}
    </div>
  );
};
