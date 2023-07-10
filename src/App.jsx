import './App.css'
import {BsFillMoonStarsFill, BsFillSunFill} from 'react-icons/bs'
import {AiFillLinkedin, AiFillGithub, AiFillMail, AiFillHtml5} from 'react-icons/ai'
import {FaFileDownload, FaHardHat, FaJava, FaPython, FaReact} from 'react-icons/fa'
import {TbBrandOpenai, TbBrandVscode} from  'react-icons/tb'
import {SiJavascript, SiTailwindcss} from 'react-icons/si'
import {BiGitBranch} from 'react-icons/bi'
import {DiCss3} from 'react-icons/di'
import dev from './public/dev-wave.png'
import groov from './public/groov.png'
import polybay from './public/polybay.png'
import weather from './public/weather.png'
import wave from './public/wave.png'
import imgsrc from './public/imgsrc.png'
import ucf from './public/ucf.png'
import { useState } from 'react'
import myResume from './public/Giampiero_Giovingo_2023.pdf'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className='min-h-screen flex flex-col'>
    <div className={darkMode ? 'dark' : 'overflow-hidden flex-col min-h-screen'}>
      <main className='flex-grow bg-white text-neutral-950 px-10 md:px-20 lg:px-40 dark:bg-gray-900 dark:text-gray-200'>
        <nav className='sticky top-0 py-8 mb-12 flex justify-between bg-white dark:bg-gray-900'>
         <h1 className='bg-gradient-to-r from-cyan-300 to-teal-500 text-white text-sm px-4 py-2 rounded-xl ml-8'>GGA</h1>
            <ul className='flex items-center'>
              <li>
                {darkMode ? <BsFillSunFill onClick={() => setDarkMode(!darkMode)} className=' cursor-pointer text-xl'/> 
                : <BsFillMoonStarsFill onClick={() => setDarkMode(!darkMode)} className=' cursor-pointer text-xl' /> }
              </li>
            </ul>
        </nav>

        <section className='h-screen'>
          <div className='text-center p-10'>
            <p className='text-3xl'>Hello, world! :) I am</p>
            <h2 className='text-5xl py-2 bg-gradient-to-r from-teal-600 to-indigo-500 text-transparent bg-clip-text font-medium md:text-7xl'>{`<`}Giampiero Giovingo{` />`}</h2>
            <h3 className='text-2xl py-2 md:text-3xl'>a Software Engineer</h3>
          </div>
          <div className='text-5xl flex justify-center gap-16 py-3 text-gray-600'>
            <a href='mailto:giampiga.cs@gmail.com'><AiFillMail /></a>
            <a href='https://www.linkedin.com/in/giampiga' ><AiFillLinkedin /></a>
            <a href='https://www.github.com/giampiga'><AiFillGithub /></a>
            <a href={myResume} download="Giampiero_Resume_2023.pdf"><FaFileDownload /></a>
          </div>
          <div className='relative mx-auto bg-gradient-to-b from-teal-500 rounded-full w-60 h-60 mt-20 overflow-hidden md:h-96 md:w-96'>
             <img src={dev} className='object-cover md:h-96 md:w-96 h-60 w-60' />
          </div>
        </section>
        
        <section className='h-screen'>
          <div>
            <h3 className='flex justify-center text-6xl py-6'>
              About Me
            </h3>
            <p className='text-lg py-2 leading-8 text-gray-800 dark:text-white'>
              Computer Science graduate from University of Central Florida looking for opportunities and services for programming or other engineering tech needs. 
              Ready to work anywhere in the USA. Passionate in learning about technology. Become a part of my journey, don't hesitate to contact me via email.
            </p>
            <div className='flex justify-center'>
              <h1 className='text-4xl mt-auto py-24'>Computer Science degree at</h1><img src={ucf} className='w-56 h-56 py-4 ml-8'/>
            </div>
            <div className='flex flex-wrap gap justify-evenly gap-11 mt-11 m-11'>
                <FaPython className='text-8xl text-teal-600' />
                <FaJava className='text-8xl text-teal-600' />
                <FaReact className='text-8xl text-teal-600' />
                <SiJavascript className='text-8xl text-teal-600' />
                <SiTailwindcss className='text-8xl text-teal-600' />
                <AiFillHtml5 className='text-8xl text-teal-600' />
                <DiCss3 className='text-8xl text-teal-600' />
                <FaHardHat className='text-8xl text-teal-600' />
                <TbBrandOpenai className='text-8xl text-teal-600' />
                <TbBrandVscode className='text-8xl text-teal-600' />
                <BiGitBranch className='text-8xl text-teal-600' />
            </div>
          </div>
        </section>

        <section>
          <div>
            <h2 className='flex justify-center text-6xl py-10'>
              Projects
            </h2>
          </div>
          <div className='flex flex-wrap justify-center  flex-col gap-10 py-10 lg:flex-row lg:flex-wrap'>
            {/* <div className='basis-1/3 flex-1'><img src={web1} className='rounded-lg object-cover' /></div> */}
            <div className='max-w-sm text-center shadow-xl p-10 rounded-xl scroll-my-10'>
                  <img src={weather} className='mx-auto'/>
                  <h3 className='text-lg font-medium pt-8 pb-2'>Weather App</h3>
                  <p className='py-2'>Front End Engineer</p>
                  <h4 className='py-4 text-teal-600'>React & Material-UI</h4>
                  <p className=' py-1'>Used OpenWeather API to fetch<br/>weather of typed user query.</p>
            </div>
            <div className='max-w-sm text-center shadow-xl p-10 rounded-xl scroll-my-10'>
                  <img src={wave} className='mx-auto'/>
                  <h3 className='text-lg font-medium pt-8 pb-2'>Wave-at-Me</h3>
                  <p className='py-2'>Full Stack Engineer</p>
                  <h4 className='py-4 text-teal-600'>React, Ethers, Solidity, <br/>Hardhat & Rinkeby</h4>
                  <p className=' py-1'>Simple web3 app that allowed <br/>any user to connect with their<br/>Metamask account and send a 'wave'<br/>attached with a message<br/> to an ever-public timeline.</p>
            </div>
            <div className='max-w-sm text-center shadow-xl p-10 rounded-xl scroll-my-10'>
                  <img src={polybay} className='mx-auto'/>
                  <h3 className='text-lg font-medium pt-8 pb-2'>Polybay</h3>
                  <p className='py-2'>Smart Contract Engineer</p>
                  <h4 className='py-4 text-teal-600'>Solidity & Hardhat</h4>
                  <p className=' py-1'>First phase of an NFT Marketplace<br/>using Polygon blockchain.</p>
            </div>
            <div className='max-w-sm text-center shadow-xl p-10 rounded-xl scroll-my-10'>
                  <img src={imgsrc} className='mx-auto'/>
                  <h3 className='text-lg font-medium pt-8 pb-2'>Image Search</h3>
                  <p className='py-2'>Front End Engineer</p>
                  <h4 className='py-4 text-teal-600'>HTML, CSS & JavaScript</h4>
                  <p className=' py-1'>Simple app that allows the user<br/>to search a query by fetching<br/>public images with the Unsplash API.</p>
            </div>
            <div className='max-w-sm text-center shadow-xl p-10 rounded-xl scroll-my-10'>
                  <img src={groov} className='mx-auto'/>
                  <h3 className='text-lg font-medium pt-8 pb-2'>Groov</h3>
                  <p className='py-2'>Front End Engineer</p>
                  <h4 className='py-4 text-teal-600'>React & Material-UI</h4>
                  <p className=' py-1'>A music based social media app<br/>that brings freestyle to the<br/>public by allowing to share creations.</p>
            </div>
              <p className='flex flex-col-reverse'>.. and this website! Made with Vite + React + Tailwind. :)</p>
          </div>
        </section>

        <footer className='flex justify-center py-10'>
          © 2023 by Giampiero Giovingo
        </footer>
      </main>
    </div>
    </div>
  )
}

export default App
