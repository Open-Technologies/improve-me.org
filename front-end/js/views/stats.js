function toPieChartData(data) {
  var result = [];
  for (var i in data) {
    result.push({
      name: i,
      value: data[i]
    });
  }
  return result;
}

echarts.init(document.getElementById('self-concept-chart')).setOption({
  title : {
    text: 'Самооценка',
    x:'center'
  },
  tooltip : {
    trigger: 'item',
    formatter: "{c} ({d}%)"
  },
  series : [
    {
      type: 'pie',
      radius : ['30%', '50%'],
      data: toPieChartData(stats.selfConcept),
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});

echarts.init(document.getElementById('temperament-chart')).setOption({
  title : {
    text: 'Темперамент',
    x:'center'
  },
  tooltip : {
    trigger: 'item',
    formatter: "{c} ({d}%)"
  },
  series : [
    {
      type: 'pie',
      radius : ['30%', '50%'],
      data: toPieChartData(stats.temperament),
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});

echarts.init(document.getElementById('aggression-chart')).setOption({
  title : {
    text: 'Агрессивность',
    x:'center'
  },
  tooltip : {
    trigger: 'item',
    formatter: "{c} ({d}%)"
  },
  series : [
    {
      type: 'pie',
      radius : ['30%', '50%'],
      data: toPieChartData(stats.aggression),
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});
