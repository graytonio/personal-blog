export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    title: 'Grayton Ward',
    subtitle: 'Cloud Architect, Platform Engineer, Homelabber',
    description: 'Personal homepage for Grayton Ward',
    image: {
        src: '/dante-preview.jpg',
        alt: 'Dante - Astro.js and Tailwind CSS theme'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Projects',
            href: '/projects'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        }
    ],
    socialLinks: [
        {
            text: 'GitHub',
            href: 'https://github.com/graytonio'
        },
        {
            text: 'Twitch',
            href: 'https://twitch.tv/graytonio'
        },
        {
            text: 'YouTube',
            href: 'https://www.youtube.com/@graytonio'
        }
    ],
    hero: {
        title: 'I like to build things',
        text: "I'm **Grayton Ward**, a platform tech lead at JFrog, helping craft the next generation of our internal platform tools. In my spare time I love learning about new technologies and creating open source projects that solve problems I have. You can keep up with my work and my learning with the blog posts here, my <a href='https://github.com/graytonio'>Github</a>, or by following me on <a href='https://twitch.tv/graytonio'>Twitch</a> where I do live coding and learning streams twice a week.",
        image: {
            src: '/hero.jpeg',
            alt: 'A person sitting at a desk in front of a computer'
        },
        actions: [
            {
                text: 'Get in Touch',
                href: '/contact'
            }
        ]
    },
    subscribe: {
        title: 'Subscribe to Dante Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        formUrl: '#'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
