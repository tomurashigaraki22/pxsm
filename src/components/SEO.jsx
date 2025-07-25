import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image }) => {
  const siteUrl = 'https://socialboost.pxxl.pro'; // Replace with your actual domain

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title ? `${title} | SocialBoost` : 'Social Boost - Grow Your Social Media Presence'}</title>
      <meta name="description" content={description || 'Boost your social media presence with our premium social media marketing services. Get real followers, likes, and engagement.'} />
      <meta name="keywords" content={keywords || 'social media marketing, social media growth, followers, likes, engagement'} />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={title || 'SocialBoost'} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || `${siteUrl}/mmmi.jpeg`} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || 'SocialBoost'} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || `${siteUrl}/mmmi.jpeg`} />
    </Helmet>
  );
};

export default SEO;