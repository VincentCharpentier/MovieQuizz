import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

const BASE_TITLE = 'Movie Quiz';

const computeTitle = (title) =>
  title ? [BASE_TITLE, title].join(' - ') : BASE_TITLE;

const PageTitle = ({ children = '' }) => (
  <Head>
    <title>{computeTitle(children)}</title>
  </Head>
);

PageTitle.propTypes = {
  children: PropTypes.string,
};

export default PageTitle;
