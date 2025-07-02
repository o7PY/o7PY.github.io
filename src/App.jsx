import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import myImage from './assets/profile.jpg';
import portfolioImage from './assets/portfolio.png';
import { link } from 'framer-motion/client';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showButton, setShowButton] = useState(false);
  const [visibleSkills, setVisibleSkills] = useState(0);
  const [lockScroll, setLockScroll] = useState(false);
  const heroCanvasRef = useRef(null);
  const pointsRef = useRef([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const skillsRef = useRef(null);


  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      const lines = gsap.utils.toArray(".skill-line");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#skills",
          start: "top top",
          end: "+=1000", // you can adjust this to feel slower or faster
          scrub: 0.5, // <== smooth scrub
          pin: true,
          markers: false,
        }
      });

      lines.forEach((line, index) => {
        tl.fromTo(
          line,
          { x: index % 2 === 0 ? -200 : 200, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          index * 0.5
        );
      });
    });

    return () => ctx.revert();
  }, []);


  const skillLines = [
    ["HTML", "CSS", "HTML/CSS"],
    ["ROS", "Gazebo", "MATLAB"],
    ["PyTorch", "Deep Learning", "Git"],
  ];


  // Show Learn More after 2s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);



  // Observe sections for active state
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  // Animate canvas background in hero only
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = heroRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener('resize', resize);

    // Initial points
    pointsRef.current = Array.from({ length: 10 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    }));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw lines between nearby points
      ctx.strokeStyle = 'rgba(31, 236, 236, 0.1)';
      ctx.lineWidth = 2;

      for (let i = 0; i < pointsRef.current.length; i++) {
        const p1 = pointsRef.current[i];

        // Move point
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Bounce off edges
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        for (let j = i + 1; j < pointsRef.current.length; j++) {
          const p2 = pointsRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Handle mouse move inside hero
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = heroCanvasRef.current.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle clicks to create new points in hero only
  useEffect(() => {
    const handleClick = (e) => {
      const rect = heroCanvasRef.current.getBoundingClientRect();
      pointsRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-black/60 border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-lg font-semibold text-cyan-400">Pragnya Yadav</div>
            <ul className="hidden md:flex space-x-6">
              {['home', 'about', 'skills', 'projects', 'contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item)}
                    className={`hover:text-cyan-400 transition-colors duration-300 ${activeSection === item ? 'text-cyan-400' : ''}`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
            {/* <button className="md:hidden text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button> */}
          </div>
        </div>
      </nav>

      {/* Hero Section with Canvas Background */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <canvas ref={heroCanvasRef} className="absolute inset-0 z-0" />
        <div className="container mx-auto px-4 py-20 relative z-10 text-center">
          <h1 className="text-5xl pb-4 md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            Pragnya Yadav
          </h1>
          {/* <p className="text-xl md:text-2xl mb-8 text-gray-300">
            AI/ML and Robotics Enthusiast
          </p> */}
          {/* <p className="max-w-2xl mx-auto text-gray-400 mb-10">
            Building beautiful, functional, and user-friendly web experiences with modern technologies.
          </p> */}
          {/* <div className={`transition-opacity duration-1000 ease-out ${showButton ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={() => scrollToSection('about')}
              className="px-6 py-2 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30"
            >
              Learn More
            </button>
          </div> */}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-black via-gray-900 to-purple-900/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">About Me</h2>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/3">
              <img
                src={myImage}
                alt="Profile"
                className="rounded-lg shadow-xl border border-cyan-500/30 transform transition-transform hover:scale-105 duration-300"
              />
            </div>
            <div className="w-full md:w-2/3">
              <p className="text-gray-300 leading-relaxed">
                Hello! I’m Pragnya, a B.Tech student at the Indian Institute of Science, passionate about exploring the frontiers of technology and innovation. From working with robotics clubs to leading corporate relations and web development initiatives at college festivals, I thrive on opportunities that challenge me to grow, learn, and contribute meaningfully.

                Whether I’m building deep learning models, optimizing data pipelines, or collaborating on robotics projects, I bring a disciplined, structured approach — honed not just through academics, but also through my passion for running marathons and gaming in immersive story-driven worlds.

                Currently, I’m interested in applying machine learning to real-world problems, exploring advanced computer science frameworks, and collaborating with diverse teams to create impactful solutions.

                When I’m not coding or researching, you’ll likely find me on a long run, immersed in an open-world video game, or planning the next big idea. Let’s connect and build something amazing together!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {/* <section id="skills" className="py-20 bg-gradient-to-b from-purple-900/30 via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Skills</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["HTML", "CSS", "JavaScript", "React", "Python", "UI/UX Design", "Tailwind CSS", "Git", "Node.js"].map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-cyan-400 rounded-full border border-cyan-500/30 hover:border-cyan-500 hover:bg-gray-700/50 transition-all duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section> */}

      {/* <section id="skills" ref={skillsRef} className="py-20 bg-gradient-to-b from-purple-900/30 via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Skills</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {skillsList.map((skill, index) => (
              <span
                key={index}
                className={`px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-cyan-400 rounded-full border border-cyan-500/30 transition-all duration-500 opacity-0 translate-x-0 ${visibleSkills > index ? `opacity-100 animate-slideInFrom${index % 2 === 0 ? 'Left' : 'Right'}` : ''
                  }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section> */}

      <section
        id="skills"
        ref={skillsRef}
        className="py-20 min-h-screen bg-gradient-to-b from-purple-900/30 via-gray-900 to-black relative"
      >

        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Skills</h2>
          <div className="space-y-6">
            {[
              ["HTML", "CSS", "HTML/CSS", "ROS", "Gazebo", "MATLAB"],
              ["Deep Learning & Neural Networks", "PyTorch", "Computer Vision"],
              ["SOLIDWORKS", "Git", "Latex", "Odometry", "SLAM", "DSA"],
              ["Control Systems", "PID", "Computer Organization and Design"]
            ].map((line, idx) => (
              <div
                key={idx}
                className="skill-line flex justify-center gap-4 opacity-0"
              >
                {line.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-cyan-400 rounded-full border border-cyan-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gradient-to-b from-black via-gray-900 to-purple-900/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Portfolio Website",
                desc: "A personal portfolio built with React and TailwindCSS showcasing my projects and skills.",
                image: "https://github.com/o7PY/o7PY.github.io/blob/main/src/assets/portfolio.png?raw=true",
                link: "https://github.com/o7PY/o7PY.github.io"
              },
              {
                title: "Task Management App",
                desc: "A productivity tool built with React and Firebase for managing daily tasks efficiently.",
                image: "https://placehold.co/600x400/1a1a1a/white?text=Task+App",
                link: '#'
              },
              {
                title: "Weather Dashboard",
                desc: "Real-time weather app using OpenWeatherMap API with responsive design.",
                image: "https://placehold.co/600x400/1a1a1a/white?text=Weather+App",
                link: '#'
              }
            ].map((project, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-gray-800 hover:border-cyan-500/30 transition-all duration-300"
              >
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.desc}</p>
                  <a
                    href={project.link}
                    className="inline-block border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300 rounded-full px-4 py-2 transition-colors"
                  >
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-purple-900/30 via-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Contact Me</h2>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/2">
              <p className="text-gray-300 mb-6">
                Have a question or want to work together? Feel free to reach out!
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:john@example.com" className="hover:text-cyan-400 transition-colors">john@example.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  <a href="https://linkedin.com/in/johndoe" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">LinkedIn</a>
                </div>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <a href="https://github.com/johndoe" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <form action="https://formspree.io/f/mzzgwebq" method="POST" className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input type="text" id="name" name="name" required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input type="email" id="email" name="email" required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                  <textarea id="message" name="message" rows="5" required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"></textarea>
                </div>
                <button type="submit"
                  className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-300 rounded-full px-6 py-2 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Pragnya Yadav. All rights reserved.</p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {/* <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 p-3 rounded-full shadow-lg hover:shadow-cyan-500/20 transition-all border border-cyan-500/40"
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button> */}

      {/* Add Keyframes for Animations */}
      <style jsx>{`
        @keyframes slideInFromLeft {
          from { transform: translateX(-50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInFromRight {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInFromLeft {
          animation: slideInFromLeft 0.5s ease-out forwards;
        }
        .animate-slideInFromRight {
          animation: slideInFromRight 0.5s ease-out forwards;
        }
          
      `}</style>
    </div>
  );
}
