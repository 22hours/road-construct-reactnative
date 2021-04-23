//  ./@types/custom-types/index.d.ts
declare module '@api_types' {
  export namespace api_types {
    type location = {
      si: string;
      gu_list: Array<string>;
    };
    type locations = Array<location>;
    type article_list_item = {
      article_id: number;
      title: string;
      summary: string;
      current_step: string;
      current_step_idx: number;
      date: number | string;
    };
    type article_marker = {
      article_id: number;
      current_step_idx: number;
      latitude: number;
      longitude: number;
    };
    type article_news_list_item = {
      title: string;
      thumbnail_uri: string;
      author: string;
      create_date: string;
    };

    ////////////////////////////////////////
    //// @@ API RESPONSE TYPES         /////
    ////////////////////////////////////////
    type api_response__article_count = {
      local_count: number; // 지자체
      media_count: number; // 언론
      government_count: number; // 정부
    };

    type api_response__article_list = Array<article_list_item>;

    type api_response__article_step_detail = {
      current_step_idx: number;
      step_list: Array<string>;
    };

    type api_response__article_detail = {
      topic_content: {
        content: string;
        article_file_list: Array<{
          url: string;
          title: string;
        }>;
      };
      related_address: {
        address_list: Array<{label: string; value: string}>;
        article_image_url_list: Array<string>;
      };
      past_related_article: {
        date: string;
        title: string;
        content: string;
      };
      related_contact: Array<{
        agency: string;
        ministry_list: Array<{name: string; phone_num: string}>;
      }>;
    };

    type api_response__article_markers = Array<article_marker>;

    type api_response__article_news = Array<article_news_list_item>;
  }
}
