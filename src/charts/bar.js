import * as d3 from'd3'; 

import React, { useEffect, useRef, useLayoutEffect} from 'react';


export default function Bar({width, height, labels, values, title, currentClass,
    barColorList, units }){

    const ref = useRef()

    // console.log(barColorList)

    
    useLayoutEffect(()=>{

        const svg = d3.select(ref.current)
        let selection = svg.selectAll("rect").data(values)

        


        selection
        .exit()
        .transition().duration(600)
        .attr("y", (d) => height)
        .attr("height", 0)
        .remove()
  


        d3.selectAll("g").remove()
        d3.selectAll("rect").remove()
        
  

    }, [labels, values])
    


    useEffect(()=>{

        drawChart()
    }, [labels, values])

    let barWidth = 20
    const margin = ({top: 5, right: 30, bottom: 30, left: 40, bar:60})


    let mdColors = ['hsla(204, 100%, 50%, 1)', 'hsla(360, 100%, 50%, 1)', 'hsla(113, 83%, 50%, 1)', 'hsla(26, 100%, 50%, 1)', 'hsla(158, 83%, 50%, 1)' ]


    function colorSpectrum(i){
        if(currentClass===3){
            return mdColors[i]
        }else{
            return barColorList[i]
        }
    }



    function moveCertainBars(){
            if(currentClass===1){
                return 55
            }else if(currentClass===2){
                return 10
            }else{
                return 0
            }
    }



    function drawChart(){

        let productCount = labels.length

        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            // .style("border", "1px solid black")

        height = height -margin.bottom



        let selection = svg.selectAll("rect").data(values)


  


        let yScale = d3.scaleLinear()
        .domain([0, d3.max(values)])
        .range([margin.top, height-margin.bottom]);

        let yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(values)])
        .range([height-margin.top,0]);


        let xScale = d3.scaleBand()
        .domain(labels)
        .range([40,width-margin.right])

        let barScale = d3.scaleLinear()
        .domain([0, productCount])
        .range([margin.bar,width-10])


        function yAxisUnits(units){
            if(units==="dollars"){
                return( d=>{return '$' + (d)})
            }
            else if(units==="percent"){
                return(d=>{return (d)+'%'})
            }
            else{
                return (d=>{return (d)})
            }
        }
            










        let xAxis = d3.axisBottom()
            .scale(xScale)

        let yAxis = d3.axisLeft()
                    .scale(yAxisScale)
                    .tickFormat(yAxisUnits(units))

        //xaxis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate("+(0)+"," + (height-margin.top+5) + ")"     )
            // .attr(`transform, translate(0, (${height-margin.bottom})  )`     )
           
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(10)")
            .style("text-anchor", "start");

        //yaxis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ","+(margin.top) +")")
            .call(yAxis)


         //cdata  - bars

     
            selection
            .enter()
            .append("rect")
            // .attr("x", (d, i) => (i*(width/values.length))+margin.left)
            .attr("x", (d, i) => barScale(i))
            .attr("y", (d) => height - yScale(d)-margin.bottom)
            .attr("width", barWidth)
            .attr("height", d=> yScale(d))
            .attr("class", "rect")
            .attr("fill", (d,i)=>colorSpectrum(i))
            .attr("id", d=> d)
            .attr("transform", "translate(" + moveCertainBars()+ ","+(margin.bottom) +")")
     




        


    }

      
   
            

            
    return <> 

        <div className="barContainer" style={{ marginLeft: "4px"}}>


   
            <h5>{title}</h5>
            <svg ref={ref} style={{ marginRight: "4px"}}/>
        </div>
        
           
    
    </>
    



    }
