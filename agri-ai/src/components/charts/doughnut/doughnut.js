// Components
import { Doughnut } from 'react-chartjs-2'
import { Chart } from 'chart.js/auto'

const Pie = (props) => {
  let defaultData = [0,0,0,0]

  const data = {
    labels: ['Maize', 'Beans', 'Wheat', 'Soybeans'],
      datasets: [{
        data: props.values?(props.values.length?props.values:defaultData):defaultData,
        backgroundColor: ['#0058FF', '#4B10BF', '#FFC700', '#EB17A4'],
        borderWidth:1,
        borderRadius: 5,
        hoverOffset: 4,
        cutout: '60%',
        radius: 100
      }]
  }

  const config = {
      options: {
          plugins:{
            legend: {
              display: false,
              position: 'top',
              labels: {
                useBorderRadius: true,
                borderRadius: 10,
                usePointStyle: false,
                boxWidth: 10,
                boxHeight: 10,
                textAlign: 'center',
                font: {
                  size: 11,
                  weight: "normal",
                  family: "muli, sans-serif"
                }
              },
              title : {
                text: 'Amount Expended',
                display: false,
                color: '#5E17EB',
                padding: 0,
                font: {
                  size: 11,
                  weight: "normal",
                  family: "poppins, sans-serif"
                }
              },
            },
            tooltip: {
              backgroundColor: '#0058FF',
              usePointStyle: true,
              bodyFont: {
                size: 11,
                weight: "normal",
                family: "poppins, sans-serif"
              },
              caretPadding: 10,
              caretSize: 3,
              cornerRadius: 5,
              // Padding between color box and text
              boxPadding: 5,
              boxHeight: 7,
              boxWidth: 7,
              titleFont: {
                size: 11,
                weight: "normal",
                family: "poppins, sans-serif"
              },
              titleColor: '#FFF',
              titleMarginBottom: 6,

            }
          },
      },
  }
  
  return ( 
    <Doughnut data={data} options={config.options} />
  )
}
 
export default Pie