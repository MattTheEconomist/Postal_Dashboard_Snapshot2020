import React, { useEffect, useState } from 'react';
import './App.css';
import  { csv } from 'd3';
import * as d3 from'd3';
import Bar from './charts/bar.js'
import Pie from './charts/pie.js'
import fullData from './CRA.json'
import BarWithState from './barWithState'


function App() {
  const [selectedClass, setSelectedClass] = useState("TotalMarketDominant")
  const [specialClass, setSpecialClass] = useState(3)

  useEffect(()=>{

      if(selectedClass==='Periodicals'){
        setSpecialClass(1)
      }else if(selectedClass==="PackageServices" || selectedClass==="Services"){
        setSpecialClass(2)
      }else if(selectedClass==="TotalMarketDominant"){
        setSpecialClass(3)
      }else{
        setSpecialClass(0)
      }



  },[selectedClass])



  let titles = {
    //what graphs go with MD? 
    // MarketDominant:{}, 
    MarketingMail:{underPie: 'Marketing Mail % Revenue Underwater', ccBar: 'Marketing Mail Cost Coverage (%)', revBar: 'Marketing Mail Revenue ($Billions)' , volBar: 'Marketing Mail Volume  (Billions)'},
    FirstClass:{underPie: 'First Class % Revenue Underwater', ccBar: 'First Class Cost Coverage (%)', revBar: 'First Class Revenue ($Billions)', volBar: 'First Class Volume (Billions)' },
    Periodicals:{underPie: 'Periodicals % Revenue Underwater' , ccBar: 'Periodicals Cost Coverage (%)', revBar: 'Periodicals Revenue ($Billions)' , volBar: 'Periodicals Volume (Billions)'},
    PackageServices:{underPie: 'Package Services % Revenue Underwater', ccBar:'Package Services Cost Coverage (%)', revBar: 'Package Revenue ($Billions)', volBar: 'Package Services Volume (Billions)'},
    Services:{underPie: 'Services % Revenue Underwater', ccBar:'Services Cost Coverage (%)', revBar: 'Services Revenue ($Billions)', volBar: 'Services Volume (Billions)'},
    TotalMarketDominant:{underPie: 'Market Dominant % Revenue Underwater', ccBar:'Market Dominant Cost Coverage (%)', revBar: 'Market Dominant Revenue ($Billions)', volBar: 'Market Dominant Volume (Billions)'},
  }

  



//create full class-level data object
    let classData = fullData.filter(row=> row.MailClass=== selectedClass)

    //create all data arrays 
    let productData = classData.map(row=> row.MailProduct)
    let revData = classData.map(row=> row.Revenue)
    let volData = classData.map(row=>row.Pieces)
    let ccData = classData.map(row=>row.CostCoverage)
    let contData = classData.map(row=> row.ContributionPP)

    volData = volData.map(cell=> cell/1000000)
    revData = revData.map(cell=> cell/1000)
    ccData = ccData.map(cell=>cell*100)


        //color stuff
        let baseColor = {
          MarketingMail: 'hsla(360, 99%, 50%, 1)', 
          FirstClass: 'hsla(204, 99%, 50%, 1)', 
          Periodicals:'hsla(113, 83%, 50%, 1)', 
          PackageServices: 'hsla(26, 99%, 50%, 1)', 
          Services: 'hsla(158, 83%, 50%, 1)', 
      
        }

        //underwater products have less saturation 
        let barColorList = []

        function generateUnderwaterColor(colorIn){
          let temp = colorIn
            temp = String(temp)
             temp = temp.toString()
             temp = temp.split(",")

            let saturation = temp[1]
            if(typeof saturation==='undefined'){
              return null
            }
            let newSaturation = parseInt(saturation.slice(1,3))
            newSaturation = newSaturation -60
            newSaturation = newSaturation.toString()+"%"
            temp[1] = newSaturation
            temp = temp.join(",")
            return temp

        }


        function generateColorList(){
        for(let i=0; i<ccData.length; i++){
          if(ccData[i]>100){
            barColorList.push(baseColor[selectedClass])
          }else{


            barColorList.push(generateUnderwaterColor(baseColor[selectedClass]))
          }
        }
      }

      generateColorList()

       




      //gen data for underwater percentage for dat pie 
      let underWaterTemp = classData.filter(row=> row.CostCoverage < 1)
      let underWater=0

      if(underWaterTemp.length !=0){
        underWater = underWaterTemp.map(row=> row.Revenue).reduce((a,b)=>a+b)
      }



      let overWaterTemp = classData.filter(row=> row.CostCoverage > 1)
      let overWater = 0

      if(overWaterTemp.length !=0){
        overWater = overWaterTemp.map(row=> row.Revenue).reduce((a,b)=>a+b)
      }

     // pie data component wont let me reformat data once its passed in :( 

      let pieData = []
      let pieDataPct = []

      if(selectedClass==="TotalMarketDominant"){
        let over2 = fullData.filter(row=>row.CostCoverage>1)
        let over3 = over2.map(row=>row.Revenue).reduce((a,b)=>a+b)
        let revFromTotalRowsOver = 45255
        over3 = over3 - revFromTotalRowsOver
        let totalMdOver = over3
        

        let under2 = fullData.filter(row=>row.CostCoverage<1)
        let under3 = under2.map(row=>row.Revenue).reduce((a,b)=>a+b)
        let revFromTotalRowsUnder = 1194
        under3 = under3 - revFromTotalRowsUnder 
        let totalMdUnder = under3 

        pieData = [totalMdUnder, totalMdOver]
        let sumRev = [totalMdUnder+ totalMdOver]
        pieDataPct = [totalMdUnder/sumRev, totalMdOver/sumRev]
        pieDataPct  = pieDataPct.map(val=>(val.toFixed(2)*100)+'%')


      }else{
      pieData = [underWater, overWater]
      let sumRev = [overWater+underWater]
       pieDataPct = [underWater/sumRev, overWater/sumRev]
      pieDataPct  = pieDataPct.map(val=>(val.toFixed(2)*100)+'%')

      }
      

      //pie color scheme matches that of bar charts
      let pieDataColors = []
      if(selectedClass==="TotalMarketDominant"){
        let mdColorOverwater = 'hsla(204, 9%, 50%, 1)' 
        let mdColorUnderwater ='hsla(204, 9%, 10%, 1)'

        pieDataColors.push( mdColorOverwater)
        pieDataColors.push(mdColorUnderwater)

      }else{
        pieDataColors.push(generateUnderwaterColor(baseColor[selectedClass]))
        pieDataColors.push(baseColor[selectedClass])
      }



      function handleClassSelect(e){

        setSelectedClass(e.target.value.split(' ').join(''))
      }

      




      
     



      return <>
    <div className="buttonArea">
    <input type="button" value="Total Market Dominant" onClick={handleClassSelect} id="TotalMDBtn" className="classBtn"/>
      <input type="button" value="First Class" onClick={handleClassSelect}  id="FirstClassBtn" className="classBtn"/>
      <input type="button" value="Marketing Mail" onClick={handleClassSelect} id="MarketingMailBtn" className="classBtn"/>
      <input type="button" value="Periodicals" onClick={handleClassSelect} id="PeriodicalsBtn" className="classBtn"/>
      <input type="button" value="Package Services" onClick={handleClassSelect} id="PackageServicesBtn"className="classBtn"/>
      <input type="button" value="Services" onClick={handleClassSelect} id="ServicesBtn"className="classBtn"/>


    </div>


    
    <div className="chartArea">
        <div className="leftArea">
            <Pie className="pieChart" size={135} values={pieData} percents={pieDataPct} title={titles[selectedClass].underPie}  pieDataColors = {pieDataColors}/>
            <Bar   className ="barChart" width={400} height={200} labels={productData} values={ccData} title={titles[selectedClass].ccBar} currentClass={specialClass} baseColor={baseColor[selectedClass]}  barColorList={barColorList} units={'percent'}/>

           

      </div>
        <div className="barArea">

        <Bar   className ="barChart" width={400} height={200} labels={productData} values={revData} title={titles[selectedClass].revBar} currentClass={specialClass} baseColor={baseColor[selectedClass]} barColorList={barColorList} units={'dollars'}/>
        <Bar   className ="barChart" width={400} height={200} labels={productData} values={volData} title={titles[selectedClass].volBar} currentClass={specialClass}baseColor={baseColor[selectedClass]}  barColorList={barColorList} units={'pieces'}/>
          
          
      </div>
        <div className="barArea">
          
         
      

        </div>
    </div>

  

      </>

}





export default App;
