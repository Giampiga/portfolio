import './App.css'
import {BsFillMoonStarsFill, BsFillSunFill} from 'react-icons/bs'
import {AiFillLinkedin, AiFillGithub, AiFillMail, AiFillHtml5} from 'react-icons/ai'
import {FaFileDownload, FaHardHat, FaJava, FaPython, FaReact, FaUniversity} from 'react-icons/fa'
import {TbBrandOpenai, TbBrandVscode} from  'react-icons/tb'
import {SiJavascript, SiTailwindcss} from 'react-icons/si'
import {BiGitBranch} from 'react-icons/bi'
import {DiCss3} from 'react-icons/di'
import dev from './public/pfp.png'
import groov from './public/groov.png'
import polybay from './public/polybay.png'
import weather from './public/weather.png'
import wave from './public/wave.png'
import imgsrc from './public/imgsrc.png'
import ucfbw from './public/ucfbw.png'
import ucf from './public/ucf.png'
import resume from './public/Giampiero_Giovingo_2023.pdf'
import { useState } from 'react'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className={darkMode ? "dark" : ""}>
      <main className=' bg-custom-powder sm:px-20 lg:px-40 dark:bg-custom-space dark:text-custom-powder text-custom-space'>
      <nav class="sticky w-full top-0 py-8 mb-12 flex justify-between bg-custom-powder dark:bg-custom-space">
        <a href='/' className='bg-gradient-to-r from-red-400 to-custom-flame text-transparent bg-clip-text text-custom-flame text-2xl px-4 ml-8'>GGA</a>
            <ul className='flex items-center mr-8'>
              <li>
                {darkMode ? <BsFillSunFill onClick={() => setDarkMode(!darkMode)} className=' cursor-pointer text-xl'/> : <BsFillMoonStarsFill onClick={() => setDarkMode(!darkMode)} className=' cursor-pointer text-xl' /> }
              </li>
            </ul>
        </nav>
        
        <section>
          <div className="text-center p-10">
            <p className='text-3xl'>Hello, world! :) I am</p>
            <h2 className='text-5xl py-2 bg-gradient-to-r from-custom-flame to-red-600 text-transparent bg-clip-text font-medium md:text-7xl'>{`<`}Giampiero Giovingo{` />`}</h2>
            <h3 className='text-2xl py-2 md:text-3xl'>a Software Engineer</h3>
          </div>
          <div className='text-5xl flex justify-center gap-16 py-3 -mx-8 text-custom-flame'>
            <a className="text-custom-flame" href='mailto:giampiga.cs@gmail.com'><AiFillMail /></a>
            <a className="text-custom-flame" href='https://www.linkedin.com/in/giampiga' ><AiFillLinkedin /></a>
            <a className="text-custom-flame" href='https://www.github.com/giampiga'><AiFillGithub /></a>
            <a className="text-custom-flame" href={resume} download="Giampiero_Giovingo_2023_Resume.pdf"><FaFileDownload /></a>
          </div>
          <div className='mx-auto bg-gradient-to-b from-custom-flame rounded-full w-60 h-60 mt-20 overflow-hidden md:h-96 md:w-96'>
            <img src={dev} className='object-cover md:h-96 md:w-96 h-60 w-60' />
          </div>
        </section>
        
        <section>
          <div>
            <h3 className='flex justify-center text-6xl py-6'>
              About Me
            </h3>
            <p className='text-lg py-2 leading-8 text-custom-space dark:text-custom-powder'>
              I am a Computer Science graduate from University of Central Florida, currently looking for opportunities for programming or other engineering tech needs. 
              Passionate in learning about technology. Ready to work anywhere in the USA. Become a part of my journey, don't hesitate to contact me via <a className="text-custom-flame" href='mailto:giampiga.cs@gmail.com'>email.</a>
            </p>
            <div className='flex justify-center mx-8 text-8xl text-custom-flame my-auto'>
              {/* <h1 className='sm:text-4xl text-xl py-24 ml-10'>Computer Science degree at</h1> */}
              <h1 className="max-md:text-8xl my-auto">{'{'}</h1>
              <FaUniversity className="sm:w-56 sm:h-64 my-auto"/> <p className="my-auto">:</p> 
              {<img src={darkMode? ucf : ucfbw} className='sm:w-52 sm:h-52 w-16 h-16 my-auto'/>}
              <h1 className="max-md:text-8xl my-auto">{'}'}</h1>
            </div>
            <div className='flex flex-wrap gap justify-evenly gap-11 mt-11 m-11 sm:text-8xl text-4xl text-custom-flame'>
                <FaPython />
                <FaJava />
                <FaReact />
                <SiJavascript />
                <SiTailwindcss />
                <AiFillHtml5 />
                <DiCss3 />
                <FaHardHat />
                <TbBrandOpenai />
                <TbBrandVscode />
                <BiGitBranch />
            </div>
          </div>
        </section>

        <section>
          <div>
            <h2 className='flex justify-center text-6xl py-10'>
              Projects
            </h2>
          </div>
          <div className='grid md:grid-cols-2 lg:flex flex-wrap justify-center gap-10 py-10'>
             {/* lg:flex-row'> */}
            {/* <div className='basis-1/3 flex-1'><img src={web1} className='rounded-lg object-cover' /></div> */}
            <div className='max-w-sm text-center shadow-xl p-10 rounded-xl scroll-my-10'>
                  <img src={weather} className='mx-auto'/>
                  <h3 className='text-lg font-medium pt-8 pb-2'>Weather App</h3>
                  <p className='py-2'>Front End Engineer</p>
                  <h4 className='py-4 text-custom-flame'>React & Material-UI</h4>
                  <p className=' py-1'>Uses OpenWeather API to fetch weather of a typed user query, in this case a location and displays current weather information to the user. </p>
            </div>
            <div className='max-w-sm text-center shadow-xl p-10 rounded-xl scroll-my-10'>
                  <img src={wave} className='mx-auto'/>
                  <h3 className='text-lg font-medium pt-8 pb-2'>Wave-at-Me</h3>
                  <p className='py-2'>Full Stack Engineer</p>
                  <h4 className='py-4 text-custom-flame'>React, Ethers, Solidity, <br/>Hardhat & Rinkeby</h4>
                  <p className=' py-1'>Simple web3 app that allowed any user to connect with their Metamask wallet and send a 'wave' attached with a message; to be displayed on an ever-public timeline.</p>
            </div>
            <div className='max-w-sm text-center shadow-xl p-10 rounded-xl scroll-my-10'>
                  <img src={polybay} className='mx-auto'/>
                  <h3 className='text-lg font-medium pt-8 pb-2'>Polybay</h3>
                  <p className='py-2'>Smart Contract Engineer</p>
                  <h4 className='py-4 text-custom-flame'>Solidity & Hardhat</h4>
                  <p className=' py-1'>First phase of an NFT Marketplace using Polygon blockchain. Allowed the user to upload any visual media to be minted onchain from the marketplace.</p>
            </div>
            <div className='max-w-sm text-center shadow-xl p-10 rounded-xl scroll-my-10'>
                  <img src={imgsrc} className='mx-auto'/>
                  <h3 className='text-lg font-medium pt-8 pb-2'>Image Search</h3>
                  <p className='py-2'>Front End Engineer</p>
                  <h4 className='py-4 text-custom-flame'>HTML, CSS & JavaScript</h4>
                  <p className=' py-1'>Simple app that allows the user to search a query by fetching public images with the Unsplash API.</p>
            </div>
            <div className='max-w-sm text-center shadow-xl p-10 rounded-xl scroll-my-10'>
                  <img src={groov} className='mx-auto'/>
                  <h3 className='text-lg font-medium pt-8 pb-2'>Groov</h3>
                  <p className='py-2'>Front End Engineer</p>
                  <h4 className='py-4 text-custom-flame'>React & Material-UI</h4>
                  <p className=' py-1'>A music based social media app that brings freestyle to thepublic by allowing to share creations.</p>
            </div>
              <div className='flex flex-col-reverse my-auto lg:ml-32'><p>.. and this website! <br/><br/> Made with Vite + React + Tailwind<br/> deployed via Vercel</p></div>
          </div>
        </section>

        <footer className='flex justify-center py-10'>
          <div className='text-2xl flex flex-col justify-center gap-8 py-3 -mx-8 text-custom-flame'>
            <div>© 2023 by Giampiero Giovingo</div>
            <div className='flex justify-center gap-16 flex-row'>
              <a className="text-custom-flame" href='mailto:giampiga.cs@gmail.com'><AiFillMail /></a>
              <a className="text-custom-flame" href='https://www.linkedin.com/in/giampiga' ><AiFillLinkedin /></a>
              <a className="text-custom-flame" href='https://www.github.com/giampiga'><AiFillGithub /></a>
              <a className="text-custom-flame" href={resume} download="Giampiero_Giovingo_2023_Resume.pdf"><FaFileDownload /></a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
