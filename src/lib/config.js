/**
 * All of these values are used throughout the site – for example, 
 * in the <meta> tags, in the footer, and in the RSS feed.
 * 
 * PLEASE BE SURE TO UPDATE THEM ALL!
 **/ 

export const siteTitle = 'Kiran S'
export const siteDescription = 'Home Page of Kiran S, Group Software Engineering Manager'
export const siteURL = 'https://www.kirans.in'
export const siteLink = 'https://in.linkedin.com/in/kiran-s'
export const siteAuthor = 'Kiran S'

// Controls how many posts are shown per page on the main blog index pages
export const postsPerPage = 5

// Controls how many tools are shown per page on the main blog index pages
export const toolsPerPage = 5

// Controls the main nav menu. (Also used by the footer and mobile nav.)
export const navItems = [
	{
		title: 'About',
		route: '/about'
	}, {
		title: 'Values',
		route: '/values' 
	}, {
		title: 'Blog',
		route: '/blog'

	}, {
		title: 'Tools',
		route: '/tools' 
	}, {
		title: 'Contact',
		route: '/contact' 
	},
]
