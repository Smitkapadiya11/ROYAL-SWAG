




every button :-

CSS:-
 .btn {

&nbsp;width: 6.5em;

&nbsp;height: 2.3em;

&nbsp;margin: 0.5em;

&nbsp;background: black;

&nbsp;color: white;

&nbsp;border: none;

&nbsp;border-radius: 0.625em;

&nbsp;font-size: 20px;

&nbsp;font-weight: bold;

&nbsp;cursor: pointer;

&nbsp;position: relative;

&nbsp;z-index: 1;

&nbsp;overflow: hidden;

}



button:hover {

&nbsp;color: black;

}



button:after {

&nbsp;content: "";

&nbsp;background: white;

&nbsp;position: absolute;

&nbsp;z-index: -1;

&nbsp;left: -20%;

&nbsp;right: -20%;

&nbsp;top: 0;

&nbsp;bottom: 0;

&nbsp;transform: skewX(-45deg) scale(0, 1);

&nbsp;transition: all 0.5s;

}



button:hover:after {

&nbsp;transform: skewX(-45deg) scale(1, 1);

&nbsp;-webkit-transition: all 0.5s;

&nbsp;transition: all 0.5s;

}

react :- 
import React from 'react';

import styled from 'styled-components';



const Button = () => {

&nbsp; return (

&nbsp;   <StyledWrapper>

&nbsp;     <button className="btn"> Button

&nbsp;     </button>

&nbsp;   </StyledWrapper>

&nbsp; );

}



const StyledWrapper = styled.div`

&nbsp; .btn {

&nbsp;  width: 6.5em;

&nbsp;  height: 2.3em;

&nbsp;  margin: 0.5em;

&nbsp;  background: black;

&nbsp;  color: white;

&nbsp;  border: none;

&nbsp;  border-radius: 0.625em;

&nbsp;  font-size: 20px;

&nbsp;  font-weight: bold;

&nbsp;  cursor: pointer;

&nbsp;  position: relative;

&nbsp;  z-index: 1;

&nbsp;  overflow: hidden;

&nbsp; }



&nbsp; button:hover {

&nbsp;  color: black;

&nbsp; }



&nbsp; button:after {

&nbsp;  content: "";

&nbsp;  background: white;

&nbsp;  position: absolute;

&nbsp;  z-index: -1;

&nbsp;  left: -20%;

&nbsp;  right: -20%;

&nbsp;  top: 0;

&nbsp;  bottom: 0;

&nbsp;  transform: skewX(-45deg) scale(0, 1);

&nbsp;  transition: all 0.5s;

&nbsp; }



&nbsp; button:hover:after {

&nbsp;  transform: skewX(-45deg) scale(1, 1);

&nbsp;  -webkit-transition: all 0.5s;

&nbsp;  transition: all 0.5s;

&nbsp; }`;



export default Button;



all product card :- 

CSS:- 
.card {

&nbsp; width: 190px;

&nbsp; height: 254px;

&nbsp; border-radius: 30px;

&nbsp; box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 50px -12px inset,

&nbsp;   rgba(0, 0, 0, 0.3) 0px 18px 26px -18px inset;

&nbsp; transition: all 0.3s ease-in-out;

&nbsp; background: linear-gradient(50deg, #c7d3dc, #d9e7f1);

&nbsp; background-size: 1px 25px;

&nbsp; -webkit-transition: all 1s ease-out;

&nbsp; -moz-transition: all 1s ease-out;

&nbsp; -o-transition: all 1s ease-out;

&nbsp; border: 1px solid #839db0;

&nbsp; cursor: pointer;

}

.card:hover {

&nbsp; background-position: 10px;

&nbsp; transform: scale(1.2);

}


React:- 

import React from 'react';

import styled from 'styled-components';



const Card = () => {

&nbsp; return (

&nbsp;   <StyledWrapper>

&nbsp;     <div className="card" />

&nbsp;   </StyledWrapper>

&nbsp; );

}



const StyledWrapper = styled.div`

&nbsp; .card {

&nbsp;   width: 190px;

&nbsp;   height: 254px;

&nbsp;   border-radius: 30px;

&nbsp;   box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 50px -12px inset,

&nbsp;     rgba(0, 0, 0, 0.3) 0px 18px 26px -18px inset;

&nbsp;   transition: all 0.3s ease-in-out;

&nbsp;   background: linear-gradient(50deg, #c7d3dc, #d9e7f1);

&nbsp;   background-size: 1px 25px;

&nbsp;   -webkit-transition: all 1s ease-out;

&nbsp;   -moz-transition: all 1s ease-out;

&nbsp;   -o-transition: all 1s ease-out;

&nbsp;   border: 1px solid #839db0;

&nbsp;   cursor: pointer;

&nbsp; }

&nbsp; .card:hover {

&nbsp;   background-position: 10px;

&nbsp;   transform: scale(1.2);

&nbsp; }`;



export default Card;




Feadback button :- 
HTML+ CSS:-

<div class="bg-white border border-slate-200 grid grid-cols-6 gap-2 rounded-xl p-2 text-sm">

&nbsp;   <h1 class="text-center text-slate-200 text-xl font-bold col-span-6">Send Feedback</h1>

&nbsp;   <textarea placeholder="Your feedback..." class="bg-slate-100 text-slate-600 h-28 placeholder:text-slate-600 placeholder:opacity-50 border border-slate-200 col-span-6 resize-none outline-none rounded-lg p-2 duration-300 focus:border-slate-600"></textarea>

&nbsp;   <button class="fill-slate-600 col-span-1 flex justify-center items-center rounded-lg p-2 duration-300 bg-slate-100 hover:border-slate-600 focus:fill-blue-200 focus:bg-blue-400 border border-slate-200">

<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 512 512">

<path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path>

</svg>

</button>

&nbsp;   <button class="fill-slate-600 col-span-1 flex justify-center items-center rounded-lg p-2 duration-300 bg-slate-100 hover:border-slate-600 focus:fill-blue-200 focus:bg-blue-400 border border-slate-200">

&nbsp;           <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 512 512">

<path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM174.6 384.1c-4.5 12.5-18.2 18.9-30.7 14.4s-18.9-18.2-14.4-30.7C146.9 319.4 198.9 288 256 288s109.1 31.4 126.6 79.9c4.5 12.5-2 26.2-14.4 30.7s-26.2-2-30.7-14.4C328.2 358.5 297.2 336 256 336s-72.2 22.5-81.4 48.1zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"></path></svg>

&nbsp;       </button>

&nbsp;   <span class="col-span-2"></span>

&nbsp;   <button class="bg-slate-100 stroke-slate-600 border border-slate-200 col-span-2 flex justify-center rounded-lg p-2 duration-300 hover:border-slate-600 hover:text-white focus:stroke-blue-200 focus:bg-blue-400">

&nbsp;           <svg fill="none" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg">

&nbsp;               <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"></path>

&nbsp;               <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" d="M10.11 13.6501L13.69 10.0601"></path>

&nbsp;           </svg>

&nbsp;       </button>



</div>

React:- import React from 'react';



const Card = () => {

&nbsp; return (

&nbsp;   <div className="bg-white border border-slate-200 grid grid-cols-6 gap-2 rounded-xl p-2 text-sm">

&nbsp;     <h1 className="text-center text-slate-200 text-xl font-bold col-span-6">Send Feedback</h1>

&nbsp;     <textarea placeholder="Your feedback..." className="bg-slate-100 text-slate-600 h-28 placeholder:text-slate-600 placeholder:opacity-50 border border-slate-200 col-span-6 resize-none outline-none rounded-lg p-2 duration-300 focus:border-slate-600" defaultValue={""} />

&nbsp;     <button className="fill-slate-600 col-span-1 flex justify-center items-center rounded-lg p-2 duration-300 bg-slate-100 hover:border-slate-600 focus:fill-blue-200 focus:bg-blue-400 border border-slate-200">

&nbsp;       <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 512 512">

&nbsp;         <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />

&nbsp;       </svg>

&nbsp;     </button>

&nbsp;     <button className="fill-slate-600 col-span-1 flex justify-center items-center rounded-lg p-2 duration-300 bg-slate-100 hover:border-slate-600 focus:fill-blue-200 focus:bg-blue-400 border border-slate-200">

&nbsp;       <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 512 512">

&nbsp;         <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM174.6 384.1c-4.5 12.5-18.2 18.9-30.7 14.4s-18.9-18.2-14.4-30.7C146.9 319.4 198.9 288 256 288s109.1 31.4 126.6 79.9c4.5 12.5-2 26.2-14.4 30.7s-26.2-2-30.7-14.4C328.2 358.5 297.2 336 256 336s-72.2 22.5-81.4 48.1zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg>

&nbsp;     </button>

&nbsp;     <span className="col-span-2" />

&nbsp;     <button className="bg-slate-100 stroke-slate-600 border border-slate-200 col-span-2 flex justify-center rounded-lg p-2 duration-300 hover:border-slate-600 hover:text-white focus:stroke-blue-200 focus:bg-blue-400">

&nbsp;       <svg fill="none" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg">

&nbsp;         <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z" />

&nbsp;         <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" d="M10.11 13.6501L13.69 10.0601" />

&nbsp;       </svg>

&nbsp;     </button>

&nbsp;   </div>

&nbsp; );

}



export default Card;



loading hand for loading or processing :-

CSS:- 

.🤚 {

&nbsp; --skin-color: #E4C560;

&nbsp; --tap-speed: 0.6s;

&nbsp; --tap-stagger: 0.1s;

&nbsp; position: relative;

&nbsp; width: 80px;

&nbsp; height: 60px;

&nbsp; margin-left: 80px;

}



.🤚:before {

&nbsp; content: '';

&nbsp; display: block;

&nbsp; width: 180%;

&nbsp; height: 75%;

&nbsp; position: absolute;

&nbsp; top: 70%;

&nbsp; right: 20%;

&nbsp; background-color: black;

&nbsp; border-radius: 40px 10px;

&nbsp; filter: blur(10px);

&nbsp; opacity: 0.3;

}



.🌴 {

&nbsp; display: block;

&nbsp; width: 100%;

&nbsp; height: 100%;

&nbsp; position: absolute;

&nbsp; top: 0;

&nbsp; left: 0;

&nbsp; background-color: var(--skin-color);

&nbsp; border-radius: 10px 40px;

}



.👍 {

&nbsp; position: absolute;

&nbsp; width: 120%;

&nbsp; height: 38px;

&nbsp; background-color: var(--skin-color);

&nbsp; bottom: -18%;

&nbsp; right: 1%;

&nbsp; transform-origin: calc(100% - 20px) 20px;

&nbsp; transform: rotate(-20deg);

&nbsp; border-radius: 30px 20px 20px 10px;

&nbsp; border-bottom: 2px solid rgba(0, 0, 0, 0.1);

&nbsp; border-left: 2px solid rgba(0, 0, 0, 0.1);

}



.👍:after {

&nbsp; width: 20%;

&nbsp; height: 60%;

&nbsp; content: '';

&nbsp; background-color: rgba(255, 255, 255, 0.3);

&nbsp; position: absolute;

&nbsp; bottom: -8%;

&nbsp; left: 5px;

&nbsp; border-radius: 60% 10% 10% 30%;

&nbsp; border-right: 2px solid rgba(0, 0, 0, 0.05);

}



.👉 {

&nbsp; position: absolute;

&nbsp; width: 80%;

&nbsp; height: 35px;

&nbsp; background-color: var(--skin-color);

&nbsp; bottom: 32%;

&nbsp; right: 64%;

&nbsp; transform-origin: 100% 20px;

&nbsp; animation-duration: calc(var(--tap-speed) \* 2);

&nbsp; animation-timing-function: ease-in-out;

&nbsp; animation-iteration-count: infinite;

&nbsp; transform: rotate(10deg);

}



.👉:before {

&nbsp; content: '';

&nbsp; position: absolute;

&nbsp; width: 140%;

&nbsp; height: 30px;

&nbsp; background-color: var(--skin-color);

&nbsp; bottom: 8%;

&nbsp; right: 65%;

&nbsp; transform-origin: calc(100% - 20px) 20px;

&nbsp; transform: rotate(-60deg);

&nbsp; border-radius: 20px;

}



.👉:nth-child(1) {

&nbsp; animation-delay: 0;

&nbsp; filter: brightness(70%);

&nbsp; animation-name: tap-upper-1;

}



.👉:nth-child(2) {

&nbsp; animation-delay: var(--tap-stagger);

&nbsp; filter: brightness(80%);

&nbsp; animation-name: tap-upper-2;

}



.👉:nth-child(3) {

&nbsp; animation-delay: calc(var(--tap-stagger) \* 2);

&nbsp; filter: brightness(90%);

&nbsp; animation-name: tap-upper-3;

}



.👉:nth-child(4) {

&nbsp; animation-delay: calc(var(--tap-stagger) \* 3);

&nbsp; filter: brightness(100%);

&nbsp; animation-name: tap-upper-4;

}



@keyframes tap-upper-1 {

&nbsp; 0%, 50%, 100% {

&nbsp;   transform: rotate(10deg) scale(0.4);

&nbsp; }



&nbsp; 40% {

&nbsp;   transform: rotate(50deg) scale(0.4);

&nbsp; }

}



@keyframes tap-upper-2 {

&nbsp; 0%, 50%, 100% {

&nbsp;   transform: rotate(10deg) scale(0.6);

&nbsp; }



&nbsp; 40% {

&nbsp;   transform: rotate(50deg) scale(0.6);

&nbsp; }

}



@keyframes tap-upper-3 {

&nbsp; 0%, 50%, 100% {

&nbsp;   transform: rotate(10deg) scale(0.8);

&nbsp; }



&nbsp; 40% {

&nbsp;   transform: rotate(50deg) scale(0.8);

&nbsp; }

}



@keyframes tap-upper-4 {

&nbsp; 0%, 50%, 100% {

&nbsp;   transform: rotate(10deg) scale(1);

&nbsp; }



&nbsp; 40% {

&nbsp;   transform: rotate(50deg) scale(1);

&nbsp; }

}



react:- 

import React from 'react';

import styled from 'styled-components';



const Loader = () => {

&nbsp; return (

&nbsp;   <StyledWrapper>

&nbsp;     <div className="🤚">

&nbsp;       <div className="👉" />

&nbsp;       <div className="👉" />

&nbsp;       <div className="👉" />

&nbsp;       <div className="👉" />

&nbsp;       <div className="🌴" />		

&nbsp;       <div className="👍" />

&nbsp;     </div>

&nbsp;   </StyledWrapper>

&nbsp; );

}



const StyledWrapper = styled.div`

&nbsp; .🤚 {

&nbsp;   --skin-color: #E4C560;

&nbsp;   --tap-speed: 0.6s;

&nbsp;   --tap-stagger: 0.1s;

&nbsp;   position: relative;

&nbsp;   width: 80px;

&nbsp;   height: 60px;

&nbsp;   margin-left: 80px;

&nbsp; }



&nbsp; .🤚:before {

&nbsp;   content: '';

&nbsp;   display: block;

&nbsp;   width: 180%;

&nbsp;   height: 75%;

&nbsp;   position: absolute;

&nbsp;   top: 70%;

&nbsp;   right: 20%;

&nbsp;   background-color: black;

&nbsp;   border-radius: 40px 10px;

&nbsp;   filter: blur(10px);

&nbsp;   opacity: 0.3;

&nbsp; }



&nbsp; .🌴 {

&nbsp;   display: block;

&nbsp;   width: 100%;

&nbsp;   height: 100%;

&nbsp;   position: absolute;

&nbsp;   top: 0;

&nbsp;   left: 0;

&nbsp;   background-color: var(--skin-color);

&nbsp;   border-radius: 10px 40px;

&nbsp; }



&nbsp; .👍 {

&nbsp;   position: absolute;

&nbsp;   width: 120%;

&nbsp;   height: 38px;

&nbsp;   background-color: var(--skin-color);

&nbsp;   bottom: -18%;

&nbsp;   right: 1%;

&nbsp;   transform-origin: calc(100% - 20px) 20px;

&nbsp;   transform: rotate(-20deg);

&nbsp;   border-radius: 30px 20px 20px 10px;

&nbsp;   border-bottom: 2px solid rgba(0, 0, 0, 0.1);

&nbsp;   border-left: 2px solid rgba(0, 0, 0, 0.1);

&nbsp; }



&nbsp; .👍:after {

&nbsp;   width: 20%;

&nbsp;   height: 60%;

&nbsp;   content: '';

&nbsp;   background-color: rgba(255, 255, 255, 0.3);

&nbsp;   position: absolute;

&nbsp;   bottom: -8%;

&nbsp;   left: 5px;

&nbsp;   border-radius: 60% 10% 10% 30%;

&nbsp;   border-right: 2px solid rgba(0, 0, 0, 0.05);

&nbsp; }



&nbsp; .👉 {

&nbsp;   position: absolute;

&nbsp;   width: 80%;

&nbsp;   height: 35px;

&nbsp;   background-color: var(--skin-color);

&nbsp;   bottom: 32%;

&nbsp;   right: 64%;

&nbsp;   transform-origin: 100% 20px;

&nbsp;   animation-duration: calc(var(--tap-speed) \* 2);

&nbsp;   animation-timing-function: ease-in-out;

&nbsp;   animation-iteration-count: infinite;

&nbsp;   transform: rotate(10deg);

&nbsp; }



&nbsp; .👉:before {

&nbsp;   content: '';

&nbsp;   position: absolute;

&nbsp;   width: 140%;

&nbsp;   height: 30px;

&nbsp;   background-color: var(--skin-color);

&nbsp;   bottom: 8%;

&nbsp;   right: 65%;

&nbsp;   transform-origin: calc(100% - 20px) 20px;

&nbsp;   transform: rotate(-60deg);

&nbsp;   border-radius: 20px;

&nbsp; }



&nbsp; .👉:nth-child(1) {

&nbsp;   animation-delay: 0;

&nbsp;   filter: brightness(70%);

&nbsp;   animation-name: tap-upper-1;

&nbsp; }



&nbsp; .👉:nth-child(2) {

&nbsp;   animation-delay: var(--tap-stagger);

&nbsp;   filter: brightness(80%);

&nbsp;   animation-name: tap-upper-2;

&nbsp; }



&nbsp; .👉:nth-child(3) {

&nbsp;   animation-delay: calc(var(--tap-stagger) \* 2);

&nbsp;   filter: brightness(90%);

&nbsp;   animation-name: tap-upper-3;

&nbsp; }



&nbsp; .👉:nth-child(4) {

&nbsp;   animation-delay: calc(var(--tap-stagger) \* 3);

&nbsp;   filter: brightness(100%);

&nbsp;   animation-name: tap-upper-4;

&nbsp; }



&nbsp; @keyframes tap-upper-1 {

&nbsp;   0%, 50%, 100% {

&nbsp;     transform: rotate(10deg) scale(0.4);

&nbsp;   }



&nbsp;   40% {

&nbsp;     transform: rotate(50deg) scale(0.4);

&nbsp;   }

&nbsp; }



&nbsp; @keyframes tap-upper-2 {

&nbsp;   0%, 50%, 100% {

&nbsp;     transform: rotate(10deg) scale(0.6);

&nbsp;   }



&nbsp;   40% {

&nbsp;     transform: rotate(50deg) scale(0.6);

&nbsp;   }

&nbsp; }



&nbsp; @keyframes tap-upper-3 {

&nbsp;   0%, 50%, 100% {

&nbsp;     transform: rotate(10deg) scale(0.8);

&nbsp;   }



&nbsp;   40% {

&nbsp;     transform: rotate(50deg) scale(0.8);

&nbsp;   }

&nbsp; }



&nbsp; @keyframes tap-upper-4 {

&nbsp;   0%, 50%, 100% {

&nbsp;     transform: rotate(10deg) scale(1);

&nbsp;   }



&nbsp;   40% {

&nbsp;     transform: rotate(50deg) scale(1);

&nbsp;   }

&nbsp; }`;



export default Loader;



sign in and sign up section :- 

CSS:- 

.form {

&nbsp; position: relative;

&nbsp; display: flex;

&nbsp; flex-direction: column;

&nbsp; gap: 10px;

&nbsp; padding: 20px;

&nbsp; background: linear-gradient(to bottom, #0077be, #3b8df2);

&nbsp; border-radius: 10px;

&nbsp; overflow: hidden;

&nbsp; perspective: 1000px;

&nbsp; transform-style: preserve-3d;

&nbsp; transform: rotateX(-10deg);

&nbsp; transition: all 0.3s ease-in-out;

&nbsp; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

&nbsp; animation: form-animation 0.5s ease-in-out;

}



@keyframes form-animation {

&nbsp; from {

&nbsp;   transform: rotateX(-30deg);

&nbsp;   opacity: 0;

&nbsp; }



&nbsp; to {

&nbsp;   transform: rotateX(0deg);

&nbsp;   opacity: 1;

&nbsp; }

}



.input {

&nbsp; padding: 10px;

&nbsp; border-radius: 5px;

&nbsp; background-color: transparent;

&nbsp; transition: border-color 0.3s ease-in-out, background-color 0.3s ease-in-out, transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

&nbsp; transform-style: preserve-3d;

&nbsp; backface-visibility: hidden;

&nbsp; color: rgb(255, 255, 255);

&nbsp; border: 2px solid #3b8df2;

&nbsp; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

}



.input::placeholder {

&nbsp; color: #fff;

}



.input:hover,

.input:focus {

&nbsp; border-color: #3b8df2;

&nbsp; background-color: rgba(255, 255, 255, 0.2);

&nbsp; transform: scale(1.05) rotateY(20deg);

&nbsp; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);

&nbsp; outline: none;

}



button {

&nbsp; padding: 10px 20px;

&nbsp; border: none;

&nbsp; border-radius: 5px;

&nbsp; background-color: #3b8df2;

&nbsp; color: #fff;

&nbsp; font-size: 16px;

&nbsp; cursor: pointer;

&nbsp; transform-style: preserve-3d;

&nbsp; backface-visibility: hidden;

&nbsp; transform: rotateX(-10deg);

&nbsp; transition: all 0.3s ease-in-out;

&nbsp; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

}



button:hover {

&nbsp; background-color: #0077be;

&nbsp; font-size: 17px;

&nbsp; transform: scale(1.05) rotateY(20deg) rotateX(10deg);

&nbsp; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

}



react : - 

import React from 'react';

import styled from 'styled-components';



const Form = () => {

&nbsp; return (

&nbsp;   <StyledWrapper>

&nbsp;     <form className="form">

&nbsp;       <input placeholder="Enter your name" className="input" type="text" />

&nbsp;       <input placeholder="Enter your email" className="input" type="text" />

&nbsp;       <input placeholder="\*\*\*\*\*\*\*\*\*" className="input" type="password" />

&nbsp;       <button>Submit</button>

&nbsp;     </form>

&nbsp;   </StyledWrapper>

&nbsp; );

}



const StyledWrapper = styled.div`

&nbsp; .form {

&nbsp;   position: relative;

&nbsp;   display: flex;

&nbsp;   flex-direction: column;

&nbsp;   gap: 10px;

&nbsp;   padding: 20px;

&nbsp;   background: linear-gradient(to bottom, #0077be, #3b8df2);

&nbsp;   border-radius: 10px;

&nbsp;   overflow: hidden;

&nbsp;   perspective: 1000px;

&nbsp;   transform-style: preserve-3d;

&nbsp;   transform: rotateX(-10deg);

&nbsp;   transition: all 0.3s ease-in-out;

&nbsp;   box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

&nbsp;   animation: form-animation 0.5s ease-in-out;

&nbsp; }



&nbsp; @keyframes form-animation {

&nbsp;   from {

&nbsp;     transform: rotateX(-30deg);

&nbsp;     opacity: 0;

&nbsp;   }



&nbsp;   to {

&nbsp;     transform: rotateX(0deg);

&nbsp;     opacity: 1;

&nbsp;   }

&nbsp; }



&nbsp; .input {

&nbsp;   padding: 10px;

&nbsp;   border-radius: 5px;

&nbsp;   background-color: transparent;

&nbsp;   transition: border-color 0.3s ease-in-out, background-color 0.3s ease-in-out, transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

&nbsp;   transform-style: preserve-3d;

&nbsp;   backface-visibility: hidden;

&nbsp;   color: rgb(255, 255, 255);

&nbsp;   border: 2px solid #3b8df2;

&nbsp;   box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

&nbsp; }



&nbsp; .input::placeholder {

&nbsp;   color: #fff;

&nbsp; }



&nbsp; .input:hover,

&nbsp; .input:focus {

&nbsp;   border-color: #3b8df2;

&nbsp;   background-color: rgba(255, 255, 255, 0.2);

&nbsp;   transform: scale(1.05) rotateY(20deg);

&nbsp;   box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);

&nbsp;   outline: none;

&nbsp; }



&nbsp; button {

&nbsp;   padding: 10px 20px;

&nbsp;   border: none;

&nbsp;   border-radius: 5px;

&nbsp;   background-color: #3b8df2;

&nbsp;   color: #fff;

&nbsp;   font-size: 16px;

&nbsp;   cursor: pointer;

&nbsp;   transform-style: preserve-3d;

&nbsp;   backface-visibility: hidden;

&nbsp;   transform: rotateX(-10deg);

&nbsp;   transition: all 0.3s ease-in-out;

&nbsp;   box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

&nbsp; }



&nbsp; button:hover {

&nbsp;   background-color: #0077be;

&nbsp;   font-size: 17px;

&nbsp;   transform: scale(1.05) rotateY(20deg) rotateX(10deg);

&nbsp;   box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

&nbsp; }`;



export default Form;



Share button :- 

CSS:- 

/\* Container Styles \*/

.tooltip-container {

&nbsp; position: relative;

&nbsp; display: inline-block;

&nbsp; font-family: "Arial", sans-serif;

&nbsp; overflow: visible;

}



/\* Button Styles \*/

.button-content {

&nbsp; display: flex;

&nbsp; align-items: center;

&nbsp; justify-content: center;

&nbsp; background: linear-gradient(135deg, #6e8efb, #a777e3);

&nbsp; color: white;

&nbsp; padding: 14px 28px;

&nbsp; border-radius: 50px;

&nbsp; cursor: pointer;

&nbsp; transition:

&nbsp;   background 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),

&nbsp;   transform 0.3s ease,

&nbsp;   box-shadow 0.4s ease;

&nbsp; box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);

&nbsp; position: relative;

&nbsp; z-index: 10;

&nbsp; overflow: hidden;

}



.button-content::before {

&nbsp; content: "";

&nbsp; position: absolute;

&nbsp; inset: 0;

&nbsp; border-radius: inherit;

&nbsp; background: linear-gradient(

&nbsp;   135deg,

&nbsp;   rgba(110, 142, 251, 0.4),

&nbsp;   rgba(167, 119, 227, 0.4)

&nbsp; );

&nbsp; filter: blur(15px);

&nbsp; opacity: 0;

&nbsp; transition: opacity 0.5s ease;

&nbsp; z-index: -1;

}



.button-content::after {

&nbsp; content: "";

&nbsp; position: absolute;

&nbsp; top: -50%;

&nbsp; left: -50%;

&nbsp; width: 200%;

&nbsp; height: 200%;

&nbsp; background: radial-gradient(

&nbsp;   circle,

&nbsp;   rgba(255, 255, 255, 0.3) 0%,

&nbsp;   rgba(255, 255, 255, 0) 70%

&nbsp; );

&nbsp; transform: scale(0);

&nbsp; transition: transform 0.6s ease-out;

&nbsp; z-index: -1;

}



.button-content:hover::before {

&nbsp; opacity: 1;

}



.button-content:hover::after {

&nbsp; transform: scale(1);

}



.button-content:hover {

&nbsp; background: linear-gradient(135deg, #a777e3, #6e8efb);

&nbsp; box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);

&nbsp; transform: translateY(-4px) scale(1.03);

}



.button-content:active {

&nbsp; transform: translateY(-2px) scale(0.98);

&nbsp; box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);

}



.text {

&nbsp; font-size: 18px;

&nbsp; font-weight: 600;

&nbsp; margin-right: 12px;

&nbsp; white-space: nowrap;

&nbsp; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

&nbsp; transition: letter-spacing 0.3s ease;

}



.button-content:hover .text {

&nbsp; letter-spacing: 1px;

}



.share-icon {

&nbsp; fill: white;

&nbsp; transition:

&nbsp;   transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),

&nbsp;   fill 0.3s ease;

&nbsp; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));

}



.button-content:hover .share-icon {

&nbsp; transform: rotate(180deg) scale(1.1);

&nbsp; fill: #ffffff;

}



/\* Tooltip Styles \*/

.tooltip-content {

&nbsp; position: absolute;

&nbsp; top: 102%;

&nbsp; left: 50%;

&nbsp; transform: translateX(-50%) scale(0.8);

&nbsp; background: white;

&nbsp; border-radius: 15px;

&nbsp; padding: 22px;

&nbsp; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);

&nbsp; opacity: 0;

&nbsp; visibility: hidden;

&nbsp; transition:

&nbsp;   opacity 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55),

&nbsp;   transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55),

&nbsp;   visibility 0.5s ease;

&nbsp; z-index: 100;

&nbsp; pointer-events: none;

&nbsp; backdrop-filter: blur(10px);

&nbsp; background: rgba(255, 255, 255, 0.9);

}



.tooltip-container:hover .tooltip-content {

&nbsp; opacity: 1;

&nbsp; visibility: visible;

&nbsp; transform: translateX(-50%) scale(1);

&nbsp; pointer-events: auto;

}



/\* Social Icons Styles \*/

.social-icons {

&nbsp; display: flex;

&nbsp; justify-content: space-between;

&nbsp; gap: 12px;

}



.social-icon {

&nbsp; display: flex;

&nbsp; align-items: center;

&nbsp; justify-content: center;

&nbsp; width: 48px;

&nbsp; height: 48px;

&nbsp; border-radius: 50%;

&nbsp; background: #f0f0f0;

&nbsp; transition:

&nbsp;   transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),

&nbsp;   background 0.3s ease,

&nbsp;   box-shadow 0.4s ease;

&nbsp; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

&nbsp; position: relative;

&nbsp; overflow: hidden;

}



.social-icon::before {

&nbsp; content: "";

&nbsp; position: absolute;

&nbsp; inset: 0;

&nbsp; background: radial-gradient(

&nbsp;   circle at center,

&nbsp;   rgba(255, 255, 255, 0.8) 0%,

&nbsp;   rgba(255, 255, 255, 0) 70%

&nbsp; );

&nbsp; opacity: 0;

&nbsp; transition: opacity 0.3s ease;

}



.social-icon:hover::before {

&nbsp; opacity: 1;

}



.social-icon svg {

&nbsp; width: 24px;

&nbsp; height: 24px;

&nbsp; fill: #333;

&nbsp; transition:

&nbsp;   transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),

&nbsp;   fill 0.3s ease;

&nbsp; z-index: 1;

}



.social-icon:hover {

&nbsp; transform: translateY(-5px) scale(1.1);

&nbsp; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);

}



.social-icon:active {

&nbsp; transform: translateY(-2px) scale(1.05);

&nbsp; box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);

}



.social-icon:hover svg {

&nbsp; transform: scale(1.2);

&nbsp; fill: white;

}



.social-icon.twitter:hover {

&nbsp; background: linear-gradient(135deg, #1da1f2, #1a91da);

}



.social-icon.facebook:hover {

&nbsp; background: linear-gradient(135deg, #1877f2, #165ed0);

}



.social-icon.linkedin:hover {

&nbsp; background: linear-gradient(135deg, #0077b5, #005e94);

}



/\* Animation for Pulse Effect \*/

@keyframes pulse {

&nbsp; 0% {

&nbsp;   box-shadow: 0 0 0 0 rgba(110, 142, 251, 0.4);

&nbsp; }

&nbsp; 70% {

&nbsp;   box-shadow: 0 0 0 20px rgba(110, 142, 251, 0);

&nbsp; }

&nbsp; 100% {

&nbsp;   box-shadow: 0 0 0 0 rgba(110, 142, 251, 0);

&nbsp; }

}



.button-content {

&nbsp; animation: pulse 3s infinite;

}



/\* Hover Ripple Effect \*/

@keyframes ripple {

&nbsp; 0% {

&nbsp;   transform: scale(0);

&nbsp;   opacity: 1;

&nbsp; }

&nbsp; 100% {

&nbsp;   transform: scale(4);

&nbsp;   opacity: 0;

&nbsp; }

}



.button-content::before {

&nbsp; content: "";

&nbsp; position: absolute;

&nbsp; inset: 0;

&nbsp; background: rgba(255, 255, 255, 0.3);

&nbsp; border-radius: inherit;

&nbsp; transform: scale(0);

&nbsp; opacity: 0;

}



.button-content:active::before {

&nbsp; animation: ripple 0.6s linear;

}



/\* Tooltip Arrow \*/

.tooltip-content::before {

&nbsp; content: "";

&nbsp; position: absolute;

&nbsp; top: -10px;

&nbsp; left: 50%;

&nbsp; transform: translateX(-50%);

&nbsp; border-width: 0 10px 10px 10px;

&nbsp; border-style: solid;

&nbsp; border-color: transparent transparent rgba(255, 255, 255, 0.9) transparent;

&nbsp; filter: drop-shadow(0 -3px 3px rgba(0, 0, 0, 0.1));

}



/\* Accessibility \*/

.button-content:focus {

&nbsp; outline: none;

&nbsp; box-shadow:

&nbsp;   0 0 0 3px rgba(110, 142, 251, 0.5),

&nbsp;   0 8px 15px rgba(0, 0, 0, 0.1);

}



.button-content:focus:not(:focus-visible) {

&nbsp; box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);

}



/\* Responsive Design \*/

@media (max-width: 768px) {

&nbsp; .button-content {

&nbsp;   padding: 12px 24px;

&nbsp;   border-radius: 40px;

&nbsp; }



&nbsp; .text {

&nbsp;   font-size: 16px;

&nbsp; }



&nbsp; .tooltip-content {

&nbsp;   width: 240px;

&nbsp;   padding: 18px;

&nbsp; }



&nbsp; .social-icon {

&nbsp;   width: 44px;

&nbsp;   height: 44px;

&nbsp; }



&nbsp; .social-icon svg {

&nbsp;   width: 20px;

&nbsp;   height: 20px;

&nbsp; }

}



@media (max-width: 480px) {

&nbsp; .button-content {

&nbsp;   padding: 10px 20px;

&nbsp; }



&nbsp; .text {

&nbsp;   font-size: 14px;

&nbsp; }



&nbsp; .tooltip-content {

&nbsp;   width: 200px;

&nbsp;   padding: 15px;

&nbsp; }



&nbsp; .social-icon {

&nbsp;   width: 40px;

&nbsp;   height: 40px;

&nbsp; }



&nbsp; .social-icon svg {

&nbsp;   width: 18px;

&nbsp;   height: 18px;

&nbsp; }

}



/\* Dark Mode Support \*/

@media (prefers-color-scheme: dark) {

&nbsp; .tooltip-content {

&nbsp;   background: rgba(30, 30, 30, 0.9);

&nbsp;   color: white;

&nbsp; }



&nbsp; .tooltip-content::before {

&nbsp;   border-color: transparent transparent rgba(30, 30, 30, 0.9) transparent;

&nbsp; }



&nbsp; .social-icon {

&nbsp;   background: #2a2a2a;

&nbsp; }



&nbsp; .social-icon svg {

&nbsp;   fill: #e0e0e0;

&nbsp; }

}



/\* Print Styles \*/

@media print {

&nbsp; .tooltip-container {

&nbsp;   display: none;

&nbsp; }

}



/\* Reduced Motion \*/

@media (prefers-reduced-motion: reduce) {

&nbsp; .button-content,

&nbsp; .share-icon,

&nbsp; .social-icon,

&nbsp; .tooltip-content {

&nbsp;   transition: none;

&nbsp; }



&nbsp; .button-content {

&nbsp;   animation: none;

&nbsp; }

}



/\* Custom Scrollbar for Tooltip Content \*/

.tooltip-content::-webkit-scrollbar {

&nbsp; width: 6px;

}



.tooltip-content::-webkit-scrollbar-track {

&nbsp; background: #f1f1f1;

&nbsp; border-radius: 3px;

}



.tooltip-content::-webkit-scrollbar-thumb {

&nbsp; background: #888;

&nbsp; border-radius: 3px;

}



.tooltip-content::-webkit-scrollbar-thumb:hover {

&nbsp; background: #555;

}



react:- 

import React from 'react';

import styled from 'styled-components';



const Tooltip = () => {

&nbsp; return (

&nbsp;   <StyledWrapper>

&nbsp;     <div className="tooltip-container">

&nbsp;       <div className="button-content">

&nbsp;         <span className="text">Share</span>

&nbsp;         <svg className="share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>

&nbsp;           <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />

&nbsp;         </svg>

&nbsp;       </div>

&nbsp;       <div className="tooltip-content">

&nbsp;         <div className="social-icons">

&nbsp;           <a href="#" className="social-icon twitter">

&nbsp;             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>

&nbsp;               <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />

&nbsp;             </svg>

&nbsp;           </a>

&nbsp;           <a href="#" className="social-icon facebook">

&nbsp;             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>

&nbsp;               <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />

&nbsp;             </svg>

&nbsp;           </a>

&nbsp;           <a href="#" className="social-icon linkedin">

&nbsp;             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>

&nbsp;               <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />

&nbsp;             </svg>

&nbsp;           </a>

&nbsp;         </div>

&nbsp;       </div>

&nbsp;     </div>

&nbsp;   </StyledWrapper>

&nbsp; );

}



const StyledWrapper = styled.div`

&nbsp; /\* Container Styles \*/

&nbsp; .tooltip-container {

&nbsp;   position: relative;

&nbsp;   display: inline-block;

&nbsp;   font-family: "Arial", sans-serif;

&nbsp;   overflow: visible;

&nbsp; }



&nbsp; /\* Button Styles \*/

&nbsp; .button-content {

&nbsp;   display: flex;

&nbsp;   align-items: center;

&nbsp;   justify-content: center;

&nbsp;   background: linear-gradient(135deg, #6e8efb, #a777e3);

&nbsp;   color: white;

&nbsp;   padding: 14px 28px;

&nbsp;   border-radius: 50px;

&nbsp;   cursor: pointer;

&nbsp;   transition:

&nbsp;     background 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),

&nbsp;     transform 0.3s ease,

&nbsp;     box-shadow 0.4s ease;

&nbsp;   box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);

&nbsp;   position: relative;

&nbsp;   z-index: 10;

&nbsp;   overflow: hidden;

&nbsp; }



&nbsp; .button-content::before {

&nbsp;   content: "";

&nbsp;   position: absolute;

&nbsp;   inset: 0;

&nbsp;   border-radius: inherit;

&nbsp;   background: linear-gradient(

&nbsp;     135deg,

&nbsp;     rgba(110, 142, 251, 0.4),

&nbsp;     rgba(167, 119, 227, 0.4)

&nbsp;   );

&nbsp;   filter: blur(15px);

&nbsp;   opacity: 0;

&nbsp;   transition: opacity 0.5s ease;

&nbsp;   z-index: -1;

&nbsp; }



&nbsp; .button-content::after {

&nbsp;   content: "";

&nbsp;   position: absolute;

&nbsp;   top: -50%;

&nbsp;   left: -50%;

&nbsp;   width: 200%;

&nbsp;   height: 200%;

&nbsp;   background: radial-gradient(

&nbsp;     circle,

&nbsp;     rgba(255, 255, 255, 0.3) 0%,

&nbsp;     rgba(255, 255, 255, 0) 70%

&nbsp;   );

&nbsp;   transform: scale(0);

&nbsp;   transition: transform 0.6s ease-out;

&nbsp;   z-index: -1;

&nbsp; }



&nbsp; .button-content:hover::before {

&nbsp;   opacity: 1;

&nbsp; }



&nbsp; .button-content:hover::after {

&nbsp;   transform: scale(1);

&nbsp; }



&nbsp; .button-content:hover {

&nbsp;   background: linear-gradient(135deg, #a777e3, #6e8efb);

&nbsp;   box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);

&nbsp;   transform: translateY(-4px) scale(1.03);

&nbsp; }



&nbsp; .button-content:active {

&nbsp;   transform: translateY(-2px) scale(0.98);

&nbsp;   box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);

&nbsp; }



&nbsp; .text {

&nbsp;   font-size: 18px;

&nbsp;   font-weight: 600;

&nbsp;   margin-right: 12px;

&nbsp;   white-space: nowrap;

&nbsp;   text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

&nbsp;   transition: letter-spacing 0.3s ease;

&nbsp; }



&nbsp; .button-content:hover .text {

&nbsp;   letter-spacing: 1px;

&nbsp; }



&nbsp; .share-icon {

&nbsp;   fill: white;

&nbsp;   transition:

&nbsp;     transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),

&nbsp;     fill 0.3s ease;

&nbsp;   filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));

&nbsp; }



&nbsp; .button-content:hover .share-icon {

&nbsp;   transform: rotate(180deg) scale(1.1);

&nbsp;   fill: #ffffff;

&nbsp; }



&nbsp; /\* Tooltip Styles \*/

&nbsp; .tooltip-content {

&nbsp;   position: absolute;

&nbsp;   top: 102%;

&nbsp;   left: 50%;

&nbsp;   transform: translateX(-50%) scale(0.8);

&nbsp;   background: white;

&nbsp;   border-radius: 15px;

&nbsp;   padding: 22px;

&nbsp;   box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);

&nbsp;   opacity: 0;

&nbsp;   visibility: hidden;

&nbsp;   transition:

&nbsp;     opacity 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55),

&nbsp;     transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55),

&nbsp;     visibility 0.5s ease;

&nbsp;   z-index: 100;

&nbsp;   pointer-events: none;

&nbsp;   backdrop-filter: blur(10px);

&nbsp;   background: rgba(255, 255, 255, 0.9);

&nbsp; }



&nbsp; .tooltip-container:hover .tooltip-content {

&nbsp;   opacity: 1;

&nbsp;   visibility: visible;

&nbsp;   transform: translateX(-50%) scale(1);

&nbsp;   pointer-events: auto;

&nbsp; }



&nbsp; /\* Social Icons Styles \*/

&nbsp; .social-icons {

&nbsp;   display: flex;

&nbsp;   justify-content: space-between;

&nbsp;   gap: 12px;

&nbsp; }



&nbsp; .social-icon {

&nbsp;   display: flex;

&nbsp;   align-items: center;

&nbsp;   justify-content: center;

&nbsp;   width: 48px;

&nbsp;   height: 48px;

&nbsp;   border-radius: 50%;

&nbsp;   background: #f0f0f0;

&nbsp;   transition:

&nbsp;     transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),

&nbsp;     background 0.3s ease,

&nbsp;     box-shadow 0.4s ease;

&nbsp;   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

&nbsp;   position: relative;

&nbsp;   overflow: hidden;

&nbsp; }



&nbsp; .social-icon::before {

&nbsp;   content: "";

&nbsp;   position: absolute;

&nbsp;   inset: 0;

&nbsp;   background: radial-gradient(

&nbsp;     circle at center,

&nbsp;     rgba(255, 255, 255, 0.8) 0%,

&nbsp;     rgba(255, 255, 255, 0) 70%

&nbsp;   );

&nbsp;   opacity: 0;

&nbsp;   transition: opacity 0.3s ease;

&nbsp; }



&nbsp; .social-icon:hover::before {

&nbsp;   opacity: 1;

&nbsp; }



&nbsp; .social-icon svg {

&nbsp;   width: 24px;

&nbsp;   height: 24px;

&nbsp;   fill: #333;

&nbsp;   transition:

&nbsp;     transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),

&nbsp;     fill 0.3s ease;

&nbsp;   z-index: 1;

&nbsp; }



&nbsp; .social-icon:hover {

&nbsp;   transform: translateY(-5px) scale(1.1);

&nbsp;   box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);

&nbsp; }



&nbsp; .social-icon:active {

&nbsp;   transform: translateY(-2px) scale(1.05);

&nbsp;   box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);

&nbsp; }



&nbsp; .social-icon:hover svg {

&nbsp;   transform: scale(1.2);

&nbsp;   fill: white;

&nbsp; }



&nbsp; .social-icon.twitter:hover {

&nbsp;   background: linear-gradient(135deg, #1da1f2, #1a91da);

&nbsp; }



&nbsp; .social-icon.facebook:hover {

&nbsp;   background: linear-gradient(135deg, #1877f2, #165ed0);

&nbsp; }



&nbsp; .social-icon.linkedin:hover {

&nbsp;   background: linear-gradient(135deg, #0077b5, #005e94);

&nbsp; }



&nbsp; /\* Animation for Pulse Effect \*/

&nbsp; @keyframes pulse {

&nbsp;   0% {

&nbsp;     box-shadow: 0 0 0 0 rgba(110, 142, 251, 0.4);

&nbsp;   }

&nbsp;   70% {

&nbsp;     box-shadow: 0 0 0 20px rgba(110, 142, 251, 0);

&nbsp;   }

&nbsp;   100% {

&nbsp;     box-shadow: 0 0 0 0 rgba(110, 142, 251, 0);

&nbsp;   }

&nbsp; }



&nbsp; .button-content {

&nbsp;   animation: pulse 3s infinite;

&nbsp; }



&nbsp; /\* Hover Ripple Effect \*/

&nbsp; @keyframes ripple {

&nbsp;   0% {

&nbsp;     transform: scale(0);

&nbsp;     opacity: 1;

&nbsp;   }

&nbsp;   100% {

&nbsp;     transform: scale(4);

&nbsp;     opacity: 0;

&nbsp;   }

&nbsp; }



&nbsp; .button-content::before {

&nbsp;   content: "";

&nbsp;   position: absolute;

&nbsp;   inset: 0;

&nbsp;   background: rgba(255, 255, 255, 0.3);

&nbsp;   border-radius: inherit;

&nbsp;   transform: scale(0);

&nbsp;   opacity: 0;

&nbsp; }



&nbsp; .button-content:active::before {

&nbsp;   animation: ripple 0.6s linear;

&nbsp; }



&nbsp; /\* Tooltip Arrow \*/

&nbsp; .tooltip-content::before {

&nbsp;   content: "";

&nbsp;   position: absolute;

&nbsp;   top: -10px;

&nbsp;   left: 50%;

&nbsp;   transform: translateX(-50%);

&nbsp;   border-width: 0 10px 10px 10px;

&nbsp;   border-style: solid;

&nbsp;   border-color: transparent transparent rgba(255, 255, 255, 0.9) transparent;

&nbsp;   filter: drop-shadow(0 -3px 3px rgba(0, 0, 0, 0.1));

&nbsp; }



&nbsp; /\* Accessibility \*/

&nbsp; .button-content:focus {

&nbsp;   outline: none;

&nbsp;   box-shadow:

&nbsp;     0 0 0 3px rgba(110, 142, 251, 0.5),

&nbsp;     0 8px 15px rgba(0, 0, 0, 0.1);

&nbsp; }



&nbsp; .button-content:focus:not(:focus-visible) {

&nbsp;   box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);

&nbsp; }



&nbsp; /\* Responsive Design \*/

&nbsp; @media (max-width: 768px) {

&nbsp;   .button-content {

&nbsp;     padding: 12px 24px;

&nbsp;     border-radius: 40px;

&nbsp;   }



&nbsp;   .text {

&nbsp;     font-size: 16px;

&nbsp;   }



&nbsp;   .tooltip-content {

&nbsp;     width: 240px;

&nbsp;     padding: 18px;

&nbsp;   }



&nbsp;   .social-icon {

&nbsp;     width: 44px;

&nbsp;     height: 44px;

&nbsp;   }



&nbsp;   .social-icon svg {

&nbsp;     width: 20px;

&nbsp;     height: 20px;

&nbsp;   }

&nbsp; }



&nbsp; @media (max-width: 480px) {

&nbsp;   .button-content {

&nbsp;     padding: 10px 20px;

&nbsp;   }



&nbsp;   .text {

&nbsp;     font-size: 14px;

&nbsp;   }



&nbsp;   .tooltip-content {

&nbsp;     width: 200px;

&nbsp;     padding: 15px;

&nbsp;   }



&nbsp;   .social-icon {

&nbsp;     width: 40px;

&nbsp;     height: 40px;

&nbsp;   }



&nbsp;   .social-icon svg {

&nbsp;     width: 18px;

&nbsp;     height: 18px;

&nbsp;   }

&nbsp; }



&nbsp; /\* Dark Mode Support \*/

&nbsp; @media (prefers-color-scheme: dark) {

&nbsp;   .tooltip-content {

&nbsp;     background: rgba(30, 30, 30, 0.9);

&nbsp;     color: white;

&nbsp;   }



&nbsp;   .tooltip-content::before {

&nbsp;     border-color: transparent transparent rgba(30, 30, 30, 0.9) transparent;

&nbsp;   }



&nbsp;   .social-icon {

&nbsp;     background: #2a2a2a;

&nbsp;   }



&nbsp;   .social-icon svg {

&nbsp;     fill: #e0e0e0;

&nbsp;   }

&nbsp; }



&nbsp; /\* Print Styles \*/

&nbsp; @media print {

&nbsp;   .tooltip-container {

&nbsp;     display: none;

&nbsp;   }

&nbsp; }



&nbsp; /\* Reduced Motion \*/

&nbsp; @media (prefers-reduced-motion: reduce) {

&nbsp;   .button-content,

&nbsp;   .share-icon,

&nbsp;   .social-icon,

&nbsp;   .tooltip-content {

&nbsp;     transition: none;

&nbsp;   }



&nbsp;   .button-content {

&nbsp;     animation: none;

&nbsp;   }

&nbsp; }



&nbsp; /\* Custom Scrollbar for Tooltip Content \*/

&nbsp; .tooltip-content::-webkit-scrollbar {

&nbsp;   width: 6px;

&nbsp; }



&nbsp; .tooltip-content::-webkit-scrollbar-track {

&nbsp;   background: #f1f1f1;

&nbsp;   border-radius: 3px;

&nbsp; }



&nbsp; .tooltip-content::-webkit-scrollbar-thumb {

&nbsp;   background: #888;

&nbsp;   border-radius: 3px;

&nbsp; }



&nbsp; .tooltip-content::-webkit-scrollbar-thumb:hover {

&nbsp;   background: #555;

&nbsp; }`;



export default Tooltip;



support button :- 

CSS:- 

.tooltip-wrapper {

&nbsp; --clr-btn: rgb(2 22 36);

&nbsp; --clr-dropdown: rgb(2 22 36);

&nbsp; --clr-nav-hover: rgb(2 22 36);

&nbsp; --clr-dropdown-hov: rgb(2 22 36);

&nbsp; --clr-dropdown-link-hov: rgb(2 22 36);

&nbsp; --clr-light: #ffffff;

}

.nav-link {

&nbsp; position: relative;

}

.tooltip-wrapper > .tooltip-container {

&nbsp; display: flex;

&nbsp; justify-content: space-around;

&nbsp; align-items: center;

}

.tooltip-container,

.tooltip-menu-with-icon {

&nbsp; list-style: none;

}

.nav-link > .tooltip-tab {

&nbsp; color: var(--clr-light);

&nbsp; background: var(--clr-btn);

&nbsp; padding: 0.8rem 1rem;

&nbsp; letter-spacing: 1px;

&nbsp; font-size: 0.75rem;

&nbsp; display: flex;

&nbsp; align-items: center;

&nbsp; column-gap: 12px;

&nbsp; justify-content: space-between;

&nbsp; text-transform: uppercase;

&nbsp; cursor: pointer;

&nbsp; border: 1px solid #00c1d5;

&nbsp; transition: 0.3s ease-in-out;

}

.nav-link > .tooltip-tab:hover svg {

&nbsp; transform: rotate(360deg);

&nbsp; transition: 0.3s ease-in-out;

}

.tooltip-links {

&nbsp; text-decoration: none;

}

.nav-link svg {

&nbsp; fill: #fff;

}

.tooltip {

&nbsp; position: absolute;

&nbsp; top: 100%;

&nbsp; left: 0;

&nbsp; min-width: 12rem;

&nbsp; max-width: 15rem;

&nbsp; transform: translateY(10px);

&nbsp; opacity: 0;

&nbsp; pointer-events: none;

&nbsp; transition: 0.5s;

&nbsp; padding: 15px 0px 0px 0px;

}

.tooltip::after {

&nbsp; content: "";

&nbsp; width: 15px;

&nbsp; height: 15px;

&nbsp; background: #00c1d5 no-repeat -30px -50px fixed;

&nbsp; top: 0px;

&nbsp; left: 6%;

&nbsp; position: absolute;

&nbsp; display: inline-block;

&nbsp; clip-path: polygon(50% 0%, 0% 100%, 100% 100%);

&nbsp; transform: rotate(360deg);

&nbsp; z-index: -1;

&nbsp; box-shadow: 0px 6px 30px rgb(2 22 36);

}

.tooltip .tooltip-menu-with-icon {

&nbsp; padding: 10px 0px;

&nbsp; background-color: var(--clr-dropdown);

&nbsp; border: 1px solid #00c1d5;

&nbsp; position: relative;

}

.tooltip-link {

&nbsp; position: relative;

}

.tooltip-link:not(:nth-last-child(2)) {

&nbsp; border-bottom: 1px solid var(--clr-dropdown);

}

.tooltip-link > a {

&nbsp; display: flex;

&nbsp; align-items: center;

&nbsp; justify-content: flex-start;

&nbsp; column-gap: 10px;

&nbsp; background-color: var(--clr-dropdown);

&nbsp; color: var(--clr-light);

&nbsp; padding: 0.5rem 1rem;

&nbsp; font-size: 0.75rem;

&nbsp; transition: 0.3s;

}

.tooltip-menu-with-icon svg {

&nbsp; height: 20px;

&nbsp; margin-left: 0px;

}

.nav-link:hover > .tooltip-tab {

&nbsp; transform: scale(1.1);

}

.nav-link:hover > .tooltip,

.tooltip-link:hover > .tooltip {

&nbsp; transform: translate(0, 0);

&nbsp; opacity: 1;

&nbsp; pointer-events: auto;

&nbsp; -webkit-transform: translate(0, 0);

&nbsp; -moz-transform: translate(0, 0);

&nbsp; -ms-transform: translate(0, 0);

&nbsp; -o-transform: translate(0, 0);

}

.nav-link:hover > .tooltip-tab {

&nbsp; transform: scale(1);

&nbsp; background-color: var(--clr-nav-hover);

}



react:- 

import React from 'react';

import styled from 'styled-components';



const Tooltip = () => {

&nbsp; return (

&nbsp;   <StyledWrapper>

&nbsp;     <div className="tooltip-wrapper">

&nbsp;       <ul className="tooltip-container">

&nbsp;         <li style={{-i: '1.1s'}} className="nav-link">

&nbsp;           <div className="tooltip-tab">

&nbsp;             <svg xmlns="http://www.w3.org/2000/svg" style={{fill: 'none'}} fill="none" viewBox="0 0 16 16" height={16} width={16}>

&nbsp;               <path strokeLinejoin="round" strokeLinecap="round" stroke="#ffffff" d="M1 10V8C1 2.5 6 1 8 1C10 1 15 2.5 15 8V10M1 10C1 10.5552 1 11.1543 1.0984 11.6204C1.24447 12.3122 2 13 3 13C4 13 4.75553 12.3122 4.9016 11.6204C5 11.1543 5 10.5552 5 10C5 9.44485 5 8.84565 4.9016 8.37961C4.75553 7.68776 4 7 3 7C2 7 1.24447 7.68776 1.0984 8.37961C1 8.84565 1 9.44485 1 10ZM15 10C15 10.5552 15 11.1543 14.9016 11.6204C14.7555 12.3122 14 13 13 13C12 13 11.2445 12.3122 11.0984 11.6204C11 11.1543 11 10.5552 11 10C11 9.44485 11 8.84565 11.0984 8.37961C11.2445 7.68776 12 7 13 7C14 7 14.7555 7.68776 14.9016 8.37961C15 8.84565 15 9.44485 15 10ZM15 10C15 15.5 12.5 15 8 15" />

&nbsp;             </svg>

&nbsp;             Support

&nbsp;           </div>

&nbsp;           <div className="tooltip">

&nbsp;             <ul className="tooltip-menu-with-icon">

&nbsp;               <li className="tooltip-link">

&nbsp;                 <a className="tooltip-links" href="#">

&nbsp;                   <svg aria-hidden="true" role="img" height={16} width={16} xmlns="http://www.w3.org/2000/svg">

&nbsp;                     <path d="m4.6.7 1.6 1.7c.6.6.7 1.6 0 2.2C5 6.1 5 6.4 7.2 8.7c2.4 2.4 2.7 2.4 4.2 1 .6-.5 1.6-.5 2.2 0l1.7 1.7v.1c.6.5.6 1.5 0 2.1v.1c-1.4 1.4-2.5 2-3.8 2h-.7c-1.6-.3-3.4-1.6-6.1-4.4C-.5 6.1-1 4 2.3.7 2.9.1 3.9.1 4.6.7m-1.2.4c-.2 0-.4.1-.5.3C.1 4 .5 5.9 5.3 10.7s6.6 5.2 9.3 2.4l.2.1-.2-.1c.3-.3.3-.7.1-1L13 10.4a.7.7 0 0 0-1 0c-1.9 1.8-2.7 1.6-5.3-1C4 6.6 3.8 5.8 5.6 4c.3-.3.3-.7 0-1L3.9 1.3a.7.7 0 0 0-.5-.2" fillRule="evenodd" fill="#FFF" />

&nbsp;                   </svg>

&nbsp;                   000-000-1111

&nbsp;                 </a>

&nbsp;               </li>

&nbsp;               <li className="tooltip-link">

&nbsp;                 <a className="tooltip-links" href="#">

&nbsp;                   <svg aria-hidden="true" role="img" viewBox="0 0 13.971 13.971" height={16} width={16} xmlns="http://www.w3.org/2000/svg">

&nbsp;                     <defs />

&nbsp;                     <g id="support-clock\_svg\_\_clock">

&nbsp;                       <path className="support-clock\_svg\_\_support-clock-cls-1" d="M6.985 13.97a6.985 6.985 0 1 1 6.986-6.985 6.993 6.993 0 0 1-6.986 6.986zm0-13.47a6.485 6.485 0 1 0 6.486 6.485A6.493 6.493 0 0 0 6.985.5" />

&nbsp;                       <path className="support-clock\_svg\_\_support-clock-cls-1" d="M11.1 7.235H6.986a.25.25 0 0 1-.25-.25V1.972a.25.25 0 1 1 .5 0v4.763h3.866a.25.25 0 0 1 0 .5z" />

&nbsp;                     </g>

&nbsp;                   </svg>

&nbsp;                   8:30AM - 5PM PST

&nbsp;                 </a>

&nbsp;               </li>

&nbsp;               <li className="tooltip-link">

&nbsp;                 <a className="tooltip-links" href="#">

&nbsp;                   <svg aria-hidden="true" role="img" viewBox="0 0 18.2 13.342" height={16} width={16} xmlns="http://www.w3.org/2000/svg">

&nbsp;                     <path style={{fill: '#fff'}} d="M17.9 0H.3a.3.3 0 0 0-.3.3v12.742a.3.3 0 0 0 .3.3h17.6a.3.3 0 0 0 .3-.3V.3a.3.3 0 0 0-.3-.3M.85.5h16.554L9.101 6.364Zm6.983 5.576 1.124.799a.25.25 0 0 0 .29 0l1.527-1.08-.133.13 6.719 6.917H.956ZM.5 12.59V.867l6.918 4.915Zm10.533-6.978L17.7.902v11.574ZM.539.5.5.554V.5Z" />

&nbsp;                   </svg>

&nbsp;                   uiverse.io

&nbsp;                 </a>

&nbsp;               </li>

&nbsp;             </ul>

&nbsp;           </div>

&nbsp;         </li>

&nbsp;       </ul>

&nbsp;     </div>

&nbsp;   </StyledWrapper>

&nbsp; );

}



const StyledWrapper = styled.div`

&nbsp; .tooltip-wrapper {

&nbsp;   --clr-btn: rgb(2 22 36);

&nbsp;   --clr-dropdown: rgb(2 22 36);

&nbsp;   --clr-nav-hover: rgb(2 22 36);

&nbsp;   --clr-dropdown-hov: rgb(2 22 36);

&nbsp;   --clr-dropdown-link-hov: rgb(2 22 36);

&nbsp;   --clr-light: #ffffff;

&nbsp; }

&nbsp; .nav-link {

&nbsp;   position: relative;

&nbsp; }

&nbsp; .tooltip-wrapper > .tooltip-container {

&nbsp;   display: flex;

&nbsp;   justify-content: space-around;

&nbsp;   align-items: center;

&nbsp; }

&nbsp; .tooltip-container,

&nbsp; .tooltip-menu-with-icon {

&nbsp;   list-style: none;

&nbsp; }

&nbsp; .nav-link > .tooltip-tab {

&nbsp;   color: var(--clr-light);

&nbsp;   background: var(--clr-btn);

&nbsp;   padding: 0.8rem 1rem;

&nbsp;   letter-spacing: 1px;

&nbsp;   font-size: 0.75rem;

&nbsp;   display: flex;

&nbsp;   align-items: center;

&nbsp;   column-gap: 12px;

&nbsp;   justify-content: space-between;

&nbsp;   text-transform: uppercase;

&nbsp;   cursor: pointer;

&nbsp;   border: 1px solid #00c1d5;

&nbsp;   transition: 0.3s ease-in-out;

&nbsp; }

&nbsp; .nav-link > .tooltip-tab:hover svg {

&nbsp;   transform: rotate(360deg);

&nbsp;   transition: 0.3s ease-in-out;

&nbsp; }

&nbsp; .tooltip-links {

&nbsp;   text-decoration: none;

&nbsp; }

&nbsp; .nav-link svg {

&nbsp;   fill: #fff;

&nbsp; }

&nbsp; .tooltip {

&nbsp;   position: absolute;

&nbsp;   top: 100%;

&nbsp;   left: 0;

&nbsp;   min-width: 12rem;

&nbsp;   max-width: 15rem;

&nbsp;   transform: translateY(10px);

&nbsp;   opacity: 0;

&nbsp;   pointer-events: none;

&nbsp;   transition: 0.5s;

&nbsp;   padding: 15px 0px 0px 0px;

&nbsp; }

&nbsp; .tooltip::after {

&nbsp;   content: "";

&nbsp;   width: 15px;

&nbsp;   height: 15px;

&nbsp;   background: #00c1d5 no-repeat -30px -50px fixed;

&nbsp;   top: 0px;

&nbsp;   left: 6%;

&nbsp;   position: absolute;

&nbsp;   display: inline-block;

&nbsp;   clip-path: polygon(50% 0%, 0% 100%, 100% 100%);

&nbsp;   transform: rotate(360deg);

&nbsp;   z-index: -1;

&nbsp;   box-shadow: 0px 6px 30px rgb(2 22 36);

&nbsp; }

&nbsp; .tooltip .tooltip-menu-with-icon {

&nbsp;   padding: 10px 0px;

&nbsp;   background-color: var(--clr-dropdown);

&nbsp;   border: 1px solid #00c1d5;

&nbsp;   position: relative;

&nbsp; }

&nbsp; .tooltip-link {

&nbsp;   position: relative;

&nbsp; }

&nbsp; .tooltip-link:not(:nth-last-child(2)) {

&nbsp;   border-bottom: 1px solid var(--clr-dropdown);

&nbsp; }

&nbsp; .tooltip-link > a {

&nbsp;   display: flex;

&nbsp;   align-items: center;

&nbsp;   justify-content: flex-start;

&nbsp;   column-gap: 10px;

&nbsp;   background-color: var(--clr-dropdown);

&nbsp;   color: var(--clr-light);

&nbsp;   padding: 0.5rem 1rem;

&nbsp;   font-size: 0.75rem;

&nbsp;   transition: 0.3s;

&nbsp; }

&nbsp; .tooltip-menu-with-icon svg {

&nbsp;   height: 20px;

&nbsp;   margin-left: 0px;

&nbsp; }

&nbsp; .nav-link:hover > .tooltip-tab {

&nbsp;   transform: scale(1.1);

&nbsp; }

&nbsp; .nav-link:hover > .tooltip,

&nbsp; .tooltip-link:hover > .tooltip {

&nbsp;   transform: translate(0, 0);

&nbsp;   opacity: 1;

&nbsp;   pointer-events: auto;

&nbsp;   -webkit-transform: translate(0, 0);

&nbsp;   -moz-transform: translate(0, 0);

&nbsp;   -ms-transform: translate(0, 0);

&nbsp;   -o-transform: translate(0, 0);

&nbsp; }

&nbsp; .nav-link:hover > .tooltip-tab {

&nbsp;   transform: scale(1);

&nbsp;   background-color: var(--clr-nav-hover);

&nbsp; }`;



export default Tooltip;











