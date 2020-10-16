import * as d3 from'd3'; 
import { svg } from 'd3';

import React, {useState, useEffect, useRef} from 'react';


export default function BarWithState({width, height, labels, values, title }){

    const [labelState, setLabelState] = useState([])
    const [valueState, setValueState] = useState([])

    

    const ref = useRef()

    let barWidth = 20
    const margin = ({top: 20, right: 30, bottom: 30, left: 40, bar:60})
    
    useEffect(()=>{
        // d3.selectAll("svg").remove()

        setLabelState(labels)
        setValueState(values)

    },[labels, values])



    useEffect(()=>{
        // setLabelState([])
        // setValueState([])
        // drawChart()
                
        // d3.selectAll("svg").remove()

        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid black")


        drawChart()
        console.log(labelState)

    }, [labelState, valueState])



    function drawChart(){
        const svg = d3.select(ref.current).append("svg")
        .attr("width", width)
        .attr("height", height)

        let selection = svg.selectAll("rect").data(valueState)

  


        let yScale = d3.scaleLinear()
        .domain([0, d3.max(valueState)])
        .range([margin.top, height-margin.bottom]);
        // .rangePoints([0,width])

        let yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(valueState)])
        .range([height-margin.top,0]);


        let xScale = d3.scaleBand()
        .domain(labelState)
        .range([40,width-margin.right])

        let barScale = d3.scaleLinear()
        .domain([0, valueState.length])
        .range([60,width-10])


        
        // let xScale = d3.scaleLinear()
        // .domain(rev)
        // .range([0,width-margin])


        let xAxis = d3.axisBottom()
            .scale(xScale)
            // .ticks((d,i)=>i)
        let yAxis = d3.axisLeft()
                    .scale(yAxisScale)

        //xaxis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (height-margin.bottom) + ")")
           
            .call(xAxis)
            // .attr("transform", "translate(" + margin.left + ",0)")
            .selectAll("text")
            .attr("transform", "rotate(10)")
            .style("text-anchor", "start");

        //yaxis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + margin.left + ",0)")
            .call(yAxis)


        //data  - bars
        selection
        .enter()
        .append("rect")
        // .attr("x", (d, i) => (i*(width/values.length))+margin.left)
        .attr("x", (d, i) => barScale(i) )
        .attr("y", (d) => height - yScale(d)-margin.bottom)
        .attr("width", barWidth)
        .attr("height", d=> yScale(d))
        .attr("fill", "red")
        .attr("id", d=> d)

        // selection
        // .exit()
        // .transition()
        // .duration(600)
        // .attr("y", d=>height)
        // .attr("height", 0)
        // .remove()
        







    }
        
   
            

            
    return <> 
        <h5>{title}</h5>
        <svg ref={ref}/>
        {/* <svg /> */}
           
    
    </>
    



    }
