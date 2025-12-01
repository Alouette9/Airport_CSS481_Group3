// tutorial:
// https://www.amcharts.com/docs/v4/tutorials/display-tooltip-on-piechart-slice-click/
// https://www.amcharts.com/docs/v4/tutorials/re-arranging-elements-of-the-chart-legend/
// https://www.amcharts.com/docs/v4/concepts/legend/

import React, { useLayoutEffect, useRef } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export function PieChart({ data = null, items = null, width = 400, height = 400 }) {
        const containerRef = useRef(null);
        const chartRef = useRef(null);

        useLayoutEffect(() => {
                const chart = am4core.create(containerRef.current, am4charts.PieChart);
                chart.rtl = false;
                chart.radius = am4core.percent(70);

                const input = items || data || [];
                chart.data = input.map(it => ({ category: it.label || it.category || '', value: Number(it.value) || 0, color: it.color }));

                const pieSeries = chart.series.push(new am4charts.PieSeries());
                pieSeries.dataFields.value = 'value';
                pieSeries.dataFields.category = 'category';
                pieSeries.slices.template.propertyFields.fill = 'color';
                pieSeries.slices.template.states.getKey('active').properties.shiftRadius = 0;
                pieSeries.slices.template.tooltipText = '{category}: {value}';
                
                // labels
                pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%"
                pieSeries.labels.template.fontSize = 11;
                pieSeries.alignLabels = false;

                // legend
                chart.legend = new am4charts.Legend();
                chart.legend.position = 'right';

                // white border around each Slice
                pieSeries.slices.template.stroke = am4core.color("#fff");
                pieSeries.slices.template.strokeWidth = 1;
                pieSeries.slices.template.strokeOpacity = 1;
                pieSeries.slices.template
                  // change the cursor on hover to make it apparent
                  // the object can be interacted with
                    .cursorOverStyle = [
                        {
                        "property": "cursor",
                        "value": "pointer"
                        }
                    ];

                chartRef.current = chart;

                return () => {
                        try {
                                if (chart) chart.dispose();
                        } catch (e) {
                                // ignore dispose errors
                        }
                };
        }, [data, items]);

        return <div ref={containerRef} style={{ width, height }} />;
}

export default PieChart;