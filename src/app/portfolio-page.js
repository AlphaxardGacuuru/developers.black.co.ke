import LoginLinks from '@/app/LoginLinks'

export const metadata = {
    title: 'Alphaxard Gacuuru - Software Engineer',
    description: 'Portfolio of Alphaxard Gacuuru, Full-Stack Software Engineer specializing in modern web technologies.',
}

const Home = () => {
    return (
        <>
            <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
                <LoginLinks />

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                                AG
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                            Alphaxard Gacuuru
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
                            Full-Stack Software Engineer crafting exceptional digital experiences with modern technologies
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            <a href="#projects" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                                View Projects
                            </a>
                            <a href="#contact" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors">
                                Get In Touch
                            </a>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Technical Expertise</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Frontend Development</h3>
                                <p className="text-gray-600 text-sm">React, Next.js, Vue.js, TypeScript, Tailwind CSS</p>
                            </div>
                            
                            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"/>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Backend Development</h3>
                                <p className="text-gray-600 text-sm">Laravel, Node.js, PHP, Python, RESTful APIs</p>
                            </div>
                            
                            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"/>
                                        <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"/>
                                        <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"/>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Database & DevOps</h3>
                                <p className="text-gray-600 text-sm">MySQL, PostgreSQL, Redis, Docker, AWS</p>
                            </div>
                            
                            <div className="text-center p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow">
                                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"/>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tools & Workflow</h3>
                                <p className="text-gray-600 text-sm">Git, GitHub, VS Code, Figma, Agile</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Section */}
                <div id="projects" className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Featured Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Black Developers Platform</h3>
                                    <p className="text-gray-600 mb-4">A community platform for Black developers built with Laravel and Next.js, featuring authentication, real-time updates, and modern UI.</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Laravel</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Next.js</span>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Tailwind</span>
                                    </div>
                                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">View Project →</a>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="h-48 bg-gradient-to-r from-green-500 to-teal-600"></div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">E-Commerce Dashboard</h3>
                                    <p className="text-gray-600 mb-4">Comprehensive admin dashboard for e-commerce management with analytics, inventory tracking, and order processing.</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Node.js</span>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">MongoDB</span>
                                    </div>
                                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">View Project →</a>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Task Management App</h3>
                                    <p className="text-gray-600 mb-4">Full-stack task management application with team collaboration, real-time updates, and productivity analytics.</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Vue.js</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Laravel</span>
                                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Redis</span>
                                    </div>
                                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">View Project →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">About Me</h2>
                        <div className="text-center">
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                I'm a passionate full-stack software engineer with expertise in modern web technologies. 
                                I love creating scalable applications that solve real-world problems and provide exceptional user experiences.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                With a strong foundation in both frontend and backend development, I specialize in building 
                                robust web applications using technologies like Laravel, Next.js, React, and modern JavaScript frameworks.
                            </p>
                            <div className="flex justify-center space-x-6">
                                <a href="https://github.com/AlphaxardGacuuru" className="text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.300 24 12c0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                </a>
                                <a href="https://linkedin.com/in/alphaxard-gacuuru" className="text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>
                                <a href="mailto:alphaxardgacuuru47@gmail.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div id="contact" className="bg-gray-900 py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center text-white mb-12">Let's Work Together</h2>
                        <div className="text-center">
                            <p className="text-xl text-gray-300 mb-8">
                                I'm always interested in new opportunities and exciting projects. 
                                Let's discuss how we can bring your ideas to life.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                                            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                                    <p className="text-gray-300">alphaxardgacuuru47@gmail.com</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
                                    <p className="text-gray-300">Available upon request</p>
                                </div>
                            </div>
                            <a 
                                href="mailto:alphaxardgacuuru47@gmail.com" 
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Send Message
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home