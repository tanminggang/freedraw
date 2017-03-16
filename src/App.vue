<template>
<div id="app" class="green1-bg">
  <router-view></router-view>
</div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
    }
  },
  created () {
    console.log('App', 'created')
  }
}
</script>

<style lang="sass">
@import '~bulma';

/*
* {
position: relative;
margin: 0px;
padding: 0px;
border: none;
outline: 0px;
font-family: 'PT Sans', arial, serif;
font-weight: normal;
background-color: transparent;
}
*/

/* universal selector */
html, body {
position: static;
}
body {
background-color: #4f4a4d;
}
canvas {
position: absolute;
}

#wrapper {
width: 960px;
margin: 0px auto;
}
#innerWrapper {
height:1660px;
width: 960px;
margin: 20px auto;
text-align: left;
}

#canvasTable {
position: absolute;
top: 360px;
margin: 0px;
padding: 10px;
border: 0px;
border-spacing: 0px;
border-collapse: separate;
}

#editorCanvas {
background-color: #bbbbbb;
position: relative;
cursor: crosshair;
}

#tool_title {
top: 120px;
padding: 10px;
height: 10px;
}
#tool_description {
top: 116px;
padding: 10px;
}

/*
button {
margin:0px;
padding:0px;
border:none;
outline:0px;
background-color:#bbaaff;
width:90px;
height:20px;
position:relative;
right:0px;
top:0px;
cursor:pointer;
}
*/

#gradientCanvas {
background-color: #ffffff;
position: relative;
}

#editorTextArea {
font-family: Courier New, Courier New, Courier, monospace;
font-weight: normal;
font-size: 14px;
width: 370px;
height: 600px;
background-color: #005E8A;
color: #ffffff;
position: relative;
padding: 10px;
resize: none;
outline: none;
wrap: soft;
}

.color {
border: 2px inset;
height: 20px;
cursor: pointer;
}



.white {
  color: white !important;
}
.red {
  color: #f03e3e !important;
}
.green {
  color: green !important;
}
.orange {
  color: #FF9800 !important;
}
.black {
  color: black !important;
}
.blueish {
  color: #197cae !important;
}
.blackish {
  color: #363636 !important;
}
.cyan5 {
  color: #22b8cf !important;
}
.cyan9 {
  color: #0b7285 !important;
}

.mobile-black {
  color: white !important;
}

/* OPEN COLOR */
.gray0-bg {
  background: #f8f9fa !important;
}
.gray1-bg {
  background: #f1f3f5 !important;
}
.gray2-bg {
  background: #e9ecef !important;
}
.yellow0-bg {
  background: #fff9db !important;
}
.yellow1-bg {
  background: #fff3bf !important;
}
.yellow2-bg {
  background: #ffec99 !important;
}
.yellow4-bg {
  background: #ffd43b !important;
}
.orange0-bg {
  background: #fff4e6 !important;
}
.orange4-bg {
  background: #ffa94d !important;
}
.orange6-bg {
  background: #fd7e14 !important;
}
.blue9-bg {
  background: #1862ab !important;
}
.cyan0-bg {
  background: #e3fafc !important;
}
.cyan2-bg {
  background: #99e9f2 !important;
}
.cyan4-bg {
  background: #3bc9db !important;
}
.cyan5-bg {
  background: #22b8cf !important;
}
.cyan9-bg {
  background: #0b7285 !important;
}
.teal0-bg {
  background: #e6fcf5 !important;
}
.red0-bg {
  background: #fff5f5 !important;
}
.red7-bg {
  background: #f03e3e !important;
}
.indigo0-bg {
  background: #edf2ff !important;
}
.indigo1-bg {
  background: #dbe4ff !important;
}
.indigo2-bg {
  background: #bac8ff !important;
}
.indigo3-bg {
  background: #91a7ff !important;
}
.indigo9-bg {
  background: #364fc7 !important;
}
.white-bg {
  background: #ffffff !important;
}
.green0-bg {
  background: #ebfbee !important;
}
.green1-bg {
  background: #d3f9d8 !important;
}
.green2-bg {
  background: #b2f2bb !important;
}
</style>
