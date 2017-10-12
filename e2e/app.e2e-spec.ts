import { RatingGeneratorPage } from './app.po';

describe('rating-generator App', () => {
  let page: RatingGeneratorPage;

  beforeEach(() => {
    page = new RatingGeneratorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
