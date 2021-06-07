//  ./@types/custom-types/index.d.ts
declare module '@global_types' {
  export namespace meta_types {
    type list_filter_type = {
      si: string;
      gu: string;
    };
    type api_response_type = {
      result: 'SUCCESS' | 'ERROR';
      data?: any;
      msg?: any;
    };
    type list_scene__tab_type = '지자체' | '언론' | '내 관심';
  }
  export namespace request_types {
    type GET_article_list = {
      page: number;
      required_count: number;
    };
  }
  export namespace api_types {
    type location = {
      si: string;
      gu_list: Array<string>;
    };
    type locations = Array<location>;

    ////////////////////////////////////////
    //// @@ API RESPONSE TYPES         /////
    ////////////////////////////////////////

    /*
    GET : ARTICLE COUNT
    https://www.notion.so/granditnomad/ee51ca61e36f4701b76b107eaccdedb4?p=96efc7b1da894b24a34f195bb012ac44
    */
    type api_response__article_count = {
      local_count: number; // 지자체
      media_count: number; // 언론
      starred_count: number; // 내 관심
    };

    /* 
    GET : ARTICLE LIST
    https://www.notion.so/granditnomad/ee51ca61e36f4701b76b107eaccdedb4?p=a4251dcd2c3e4c78821f218d9da27bbc
    */
    type article_list_item = {
      article_id: number;
      title: string;
      summary: string;
      date: number | string;
    };
    type api_response__article_list = Array<article_list_item>;

    /* 
    GET : MEDIA LIST
    https://www.notion.so/granditnomad/ee51ca61e36f4701b76b107eaccdedb4?p=dcab706444604531ab23f0567dd264a7
    */
    type media_list_item = {
      media_id: number;
      title: string;
      author: string;
      thumbnail_uri: string;
      create_date: string;
      media_link: string;
      site_name: string;
    };
    type api_response__media_list = Array<media_list_item>;

    /* 
    GET : ARTICLE DETAIL
    https://www.notion.so/granditnomad/ee51ca61e36f4701b76b107eaccdedb4?p=a4251dcd2c3e4c78821f218d9da27bbc
    */
    type api_response__article_detail = {
      topic_content: {
        content: string;
        article_file_list: {
          url: string;
          title: string;
        }[];
      };
      related_address: {
        address_list: Array<{
          label: string;
          value: string;
          address_type: 'ROAD' | 'PARCEL';
        }>;
        article_image_list: Array<{title: string; url: string}>;
      };
      article_step: {
        current_step_idx: number;
        step_list: Array<string>;
      };
      related_contact: Array<{
        agency: string;
        ministry_list: Array<{name: string; phone_num: string}>;
      }>;
      starred: boolean;
      article_id: number;
    };

    /* 
    GET : ARTICLE DETAIL
    https://www.notion.so/granditnomad/ee51ca61e36f4701b76b107eaccdedb4?p=a4251dcd2c3e4c78821f218d9da27bbc
    */
    type api_response__article_step_detail = {
      current_step_idx: number;
      step_list: Array<string>;
    };

    /* 
    GET : MARKER LIST
    https://www.notion.so/granditnomad/ee51ca61e36f4701b76b107eaccdedb4?p=d51c0f472ad54db1b51eb922ae860ce6
    */
    type article_marker = {
      article_id: number;
      shorten_address: string;
      latitude: number;
      longitude: number;
      label: string;
    };
    type api_response__article_marker_list = Array<article_marker>;

    /* 
    GET : ARTICLE MARKER DETAIL
    https://www.notion.so/granditnomad/ee51ca61e36f4701b76b107eaccdedb4?p=db6832f084a544d9ad22fd13c4340178
    */
    type article_marker_detail = {
      article_id: number;
      title: string;
      summary: string;
      date: number | string;
      starred: boolean;
    };

    /* 
    GET : ARTICLE NEWS LIST
    https://www.notion.so/granditnomad/ee51ca61e36f4701b76b107eaccdedb4?p=db6832f084a544d9ad22fd13c4340178
    */
    type article_news_list_item = {
      title: string;
      thumbnail_uri: string;
      author: string;
      create_date: string;
      site_name: string;
    };
    type api_response__article_news = Array<article_news_list_item>;
  }
}
