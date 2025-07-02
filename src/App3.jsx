// App.jsx

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
    const [scrollY, setScrollY] = useState(0);
    const [navVisible, setNavVisible] = useState(false);
    const canvasRef = useRef(null);

    // Skills data (2-3 per line)
    const skillsRows = [
        ['JavaScript', 'TypeScript', 'React'],
        ['Node.js', 'Python', 'Tailwind CSS'],
        ['GraphQL', 'MongoDB', 'Framer Motion']
    ];

    // Background color based on scroll position
    const getBackgroundColor = () => {
        const sectionHeight = window.innerHeight;
        const sectionIndex = Math.floor(scrollY / sectionHeight);

        const colors = [
            '#0a0a0a', // hero - dark black
            '#11111a', // about - deep navy
            '#0f0f1c', // skills - midnight blue
            '#14142b', // projects - slate purple
            '#1a1a1a'  // contact - charcoal
        ];

        return colors[Math.min(sectionIndex, colors.length - 1)] || '#0a0a0a';
    };

    // Handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setScrollY(y);

            // Show navbar after scrolling past hero
            if (y > window.innerHeight * 0.8) {
                setNavVisible(true);
            } else {
                setNavVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Particle network animation in hero section
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const PARTICLE_COUNT = 75;
        const MAX_DISTANCE = 120;

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.alpha = 0.3 + Math.random() * 0.3;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        const connectParticles = (p1, p2) => {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MAX_DISTANCE) {
                const opacity = 1 - dist / MAX_DISTANCE;
                ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.4})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Connect particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    connectParticles(particles[i], particles[j]);
                }
            }

            requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            // Reset particle positions
            particles.forEach(p => {
                p.x = Math.random() * width;
                p.y = Math.random() * height;
            });
        };

        window.addEventListener('resize', handleResize);

        // Add new connections on click
        const handleClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Add 5 new particles around the click point
            for (let i = 0; i < 5; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 30;
                particles.push({
                    x: x + Math.cos(angle) * distance,
                    y: y + Math.sin(angle) * distance,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    alpha: 0.3 + Math.random() * 0.3,
                    update: function () {
                        this.x += this.vx;
                        this.y += this.vy;

                        if (this.x < 0) this.x = width;
                        if (this.x > width) this.x = 0;
                        if (this.y < 0) this.y = height;
                        if (this.y > height) this.y = 0;
                    },
                    draw: function () {
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(0, 255, 255, ${this.alpha})`;
                        ctx.fill();
                    }
                });
            }
        };

        canvas.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundColor: getBackgroundColor() }}>
            {/* Hero Section */}
            <section id="hero" className="relative h-screen overflow-hidden">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-5xl md:text-7xl font-bold text-cyan-400 text-center px-4"
                    >
                        Your Name
                    </motion.h1>
                </div>
            </section>

            {/* Navbar */}
            <AnimatePresence>
                {navVisible && (
                    <motion.nav
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        className="fixed top-4 right-4 z-50 hidden lg:block"
                    >
                        <ul className="flex space-x-6">
                            {['About', 'Skills', 'Projects', 'Contact'].map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="text-cyan-300 hover:text-cyan-100 transition-colors duration-300 font-medium"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* About Section */}
            <section id="about" className="min-h-screen py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold mb-8 text-cyan-300 border-b border-cyan-700 pb-2 inline-block"
                    >
                        About Me
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-300 leading-relaxed"
                    >
                        I'm a passionate developer who loves creating innovative solutions to complex problems. With a strong foundation in modern web technologies, I specialize in building responsive, scalable applications that deliver exceptional user experiences. My approach combines creativity with technical expertise to transform ideas into reality.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-6 text-lg md:text-xl text-gray-300 leading-relaxed"
                    >
                        Whether it's designing elegant UI components or optimizing backend performance, I'm always excited to learn and grow as a developer. I thrive in collaborative environments where innovation and excellence are valued, and I'm constantly exploring new technologies to expand my skill set.
                    </motion.p>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="min-h-screen py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold mb-12 text-cyan-300 border-b border-cyan-700 pb-2 inline-block"
                    >
                        Skills
                    </motion.h2>

                    <div className="space-y-12">
                        {skillsRows.map((row, rowIndex) => (
                            <motion.div
                                key={rowIndex}
                                initial={{ opacity: 0, x: rowIndex % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.2 + (rowIndex * 0.3),
                                    ease: "easeOut"
                                }}
                                className="flex flex-wrap gap-4 justify-center"
                            >
                                {row.map((skill, skillIndex) => (
                                    <div
                                        key={skillIndex}
                                        className="px-6 py-3 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg border border-cyan-700/50 backdrop-blur-sm shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 transition-all duration-300"
                                    >
                                        <span className="text-cyan-300 font-medium">{skill}</span>
                                    </div>
                                ))}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="min-h-screen py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold mb-12 text-cyan-300 border-b border-cyan-700 pb-2 inline-block"
                    >
                        Projects
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3].map((project, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3 + (index * 0.1) }}
                                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-cyan-500 transition-all duration-500"
                            >
                                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                                    <img
                                        src={`https://picsum.photos/id/ ${30 + index}/600/400`}
                                        alt={`Project ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-cyan-300 mb-2">Project Title {index + 1}</h3>
                                    <p className="text-gray-400 mb-4">
                                        A brief description of this project showcasing its purpose and key features.
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {['React', 'Node.js', 'MongoDB'][index % 3] &&
                                            ['React', 'Node.js', 'MongoDB'].slice(0, index + 1).map((tech, tIndex) => (
                                                <span
                                                    key={tIndex}
                                                    className="text-xs px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded-md"
                                                >
                                                    {tech}
                                                </span>
                                            ))
                                        }
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <a
                                            href="#"
                                            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-200 transition-colors"
                                        >
                                            <span>View Project</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                <polyline points="15 3 21 3 21 9"></polyline>
                                                <line x1="10" y1="14" x2="21" y2="3"></line>
                                            </svg>
                                        </a>

                                        <div className="flex gap-2">
                                            <a href="#" className="text-cyan-400 hover:text-cyan-200 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            </a>

                                            <a href="#" className="text-cyan-400 hover:text-cyan-200 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.18h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zm-11.982 0h-3.554v-11.18h3.554v11.18zm-5.928-11.18h3.554v11.18h-3.554v-11.18zm-5.927 0h3.554v11.18h-3.554v-11.18z" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="min-h-screen py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold mb-12 text-cyan-300 border-b border-cyan-700 pb-2 inline-block"
                    >
                        Contact
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center"
                    >
                        <p className="text-xl text-gray-300 mb-8">
                            Let's connect! You can find me on these platforms:
                        </p>

                        <div className="flex flex-wrap justify-center gap-6">
                            {[
                                {
                                    name: 'GitHub', url: '#', icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: 'LinkedIn', url: '#', icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.962 0-1.74-.79-1.74-1.764s.778-1.764 1.74-1.764 1.74.79 1.74 1.764-.778 1.764-1.74 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: 'Email', url: 'mailto:you@example.com', icon: (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2l-8 5.333L4 6h16zM4 18V8.155l7.438 4.959c.195.13.438.195.675.195.237 0 .48-.065.675-.195L20 8.155V18H4z" />
                                        </svg>
                                    )
                                }
                            ].map((platform, index) => (
                                <a
                                    key={index}
                                    href={platform.url}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/50 hover:bg-cyan-900/50 transition-all duration-300"
                                >
                                    <div className="text-cyan-300">{platform.icon}</div>
                                    <span className="text-cyan-300 font-medium">{platform.name}</span>
                                </a>
                            ))}
                        </div>

                        <motion.p
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="mt-12 text-gray-400"
                        >
                            &copy; {new Date().getFullYear()} Your Name. All rights reserved.
                        </motion.p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default App;