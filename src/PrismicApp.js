import React from 'react';
import 'whatwg-fetch';
import Prismic from 'prismic.io';
import PrismicToolbar from 'prismic-toolbar';
import PrismicConfig from './prismic-configuration';
import App from './App';

export default class PrismicApp extends React.Component {

  static validateOnboarding() {
    const repoEndpoint = PrismicConfig.apiEndpoint.replace('/api', '');
    fetch(`${repoEndpoint}/app/settings/onboarding/run`, { method: 'POST' })
      .catch(() => console.log('Cannot access your repository, check your api endpoint'));
  }

  state = {
    prismicCtx: null,
  }

  componentWillMount() {
    PrismicApp.validateOnboarding();
    this.buildContext().then((prismicCtx) => {
      this.setState({ prismicCtx });
    }).catch((e) => {
      console.error(`Cannot contact the API, check your prismic configuration:\n${e}`);
    });
  }

  refreshToolbar() {
    const maybeCurrentExperiment = this.api.currentExperiment();
    if (maybeCurrentExperiment) {
      PrismicToolbar.startExperiment(maybeCurrentExperiment.googleId());
    }
    PrismicToolbar.setup(PrismicConfig.apiEndpoint);
  }

  buildContext() {
    const accessToken = PrismicConfig.accessToken;
    return Prismic.api(PrismicConfig.apiEndpoint, { accessToken }).then(api => ({
      api,
      endpoint: PrismicConfig.apiEndpoint,
      accessToken,
      linkResolver: PrismicConfig.linkResolver,
      toolbar: this.refreshToolbar,
    }));
  }

  render() {
    return <App prismicCtx={this.state.prismicCtx} />;
  }
}
