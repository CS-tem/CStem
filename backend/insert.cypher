MATCH (n) DETACH DELETE n;

CREATE (article_0:Article { id : 0, title : 'Training Region-based Object Detectors with Online Hard Example Mining', year : 2016, venue_id : 0, n_citations : 4 });
CREATE (article_1:Article { id : 1, title : 'NeRS: Neural Reflectance Surfaces for Sparse-View 3D Reconstruction in the Wild', year : 2021, venue_id : 1, n_citations : 2 });
CREATE (article_2:Article { id : 2, title : 'Actions ~ Transformations', year : 2017, venue_id : 0, n_citations : 1 });
CREATE (article_3:Article { id : 3, title : 'ViSER: Video Surface Embeddings for Articulated 3D Shape Reconstruction', year : 2021, venue_id : 1, n_citations : 1 });
CREATE (article_4:Article { id : 4, title : 'Learning to Segment Rigid Motions from Two Frames', year : 2016, venue_id : 0, n_citations : 0 });
CREATE (article_5:Article { id : 5, title : 'GLASS: Geometric Latent Augmentation for Shape Spaces', year : 2022, venue_id : 0, n_citations : 0 });
CREATE (article_6:Article { id : 6, title : 'DECOR-GAN: 3D Shape Detailization by Conditional Refinement', year : 2021, venue_id : 0, n_citations : 1 });
CREATE (article_7:Article { id : 7, title : 'Generalizing Across Domains via Cross-Gradient Training', year : 2019, venue_id : 2, n_citations : 0 });

CREATE (author_0:Author { id : 0, name : 'Abhinav Gupta', n_pubs : 3, n_citations : 6, h_index : 1 });
CREATE (author_1:Author { id : 1, name : 'Deva Ramanan', n_pubs : 4, n_citations : 4, h_index : 1 });
CREATE (author_2:Author { id : 2, name : 'Xilin Chen', n_pubs : 1, n_citations : 0, h_index : 0 });
CREATE (author_3:Author { id : 3, name : 'Siddhartha Chaudhuri', n_pubs : 4, n_citations : 2, h_index : 1 });

CREATE (country_0:Country { id : 0, name : 'India' });
CREATE (country_1:Country { id : 1, name : 'China' });
CREATE (country_2:Country { id : 2, name : 'USA' });

CREATE (institute_0:Institute { id : 0, name : 'Indian Institute of Technology Bombay', n_members : 1, n_pubs : 4, n_citations : 2 });
CREATE (institute_1:Institute { id : 1, name : 'Chinese Academy of Sciences', n_members : 1, n_pubs : 1, n_citations : 0 });
CREATE (institute_2:Institute { id : 2, name : 'Carnegie Mellon University', n_members : 2, n_pubs : 7, n_citations : 10 });

CREATE (topic_0:Topic { id : 0, name : 'computer vision', n_articles : 7, n_authors : 4, n_citations : 8 });
CREATE (topic_1:Topic { id : 1, name : 'natural language processing', n_articles : 0, n_authors : 0, n_citations : 0 });
CREATE (topic_2:Topic { id : 2, name : 'machine learning', n_articles : 3, n_authors : 3, n_citations : 5 });

CREATE (venue_0:Venue { id : 0, name : 'Conference on Computer Vision and Pattern Recognition', acronym : 'CVPR', type : 'Conference', n_pubs : 5, n_citations : 6, flexibility : 0 });
CREATE (venue_1:Venue { id : 1, name : 'Conference and Workshop on Neural Information Processing Systems', acronym : 'NeurIPS', type : 'Conference', n_pubs : 2, n_citations : 3, flexibility : 1 });
CREATE (venue_2:Venue { id : 2, name : 'International Conference on Learning Representations', acronym : 'ICLR', type : 'Conference', n_pubs : 1, n_citations : 0, flexibility : 1 });

MATCH (a:Article), (b:Topic) WHERE a.id = 0 AND b.id = 0 CREATE (a)<-[article_topic_0:ArticleTopic]-(b);
MATCH (a:Article), (b:Topic) WHERE a.id = 0 AND b.id = 2 CREATE (a)<-[article_topic_1:ArticleTopic]-(b);
MATCH (a:Article), (b:Topic) WHERE a.id = 1 AND b.id = 0 CREATE (a)<-[article_topic_2:ArticleTopic]-(b);
MATCH (a:Article), (b:Topic) WHERE a.id = 2 AND b.id = 2 CREATE (a)<-[article_topic_3:ArticleTopic]-(b);
MATCH (a:Article), (b:Topic) WHERE a.id = 3 AND b.id = 0 CREATE (a)<-[article_topic_4:ArticleTopic]-(b);
MATCH (a:Article), (b:Topic) WHERE a.id = 4 AND b.id = 0 CREATE (a)<-[article_topic_5:ArticleTopic]-(b);
MATCH (a:Article), (b:Topic) WHERE a.id = 5 AND b.id = 0 CREATE (a)<-[article_topic_6:ArticleTopic]-(b);
MATCH (a:Article), (b:Topic) WHERE a.id = 5 AND b.id = 2 CREATE (a)<-[article_topic_7:ArticleTopic]-(b);
MATCH (a:Article), (b:Topic) WHERE a.id = 6 AND b.id = 0 CREATE (a)<-[article_topic_8:ArticleTopic]-(b);
MATCH (a:Article), (b:Topic) WHERE a.id = 7 AND b.id = 0 CREATE (a)<-[article_topic_9:ArticleTopic]-(b);

MATCH (a:Author), (b:Article) WHERE a.id = 0 AND b.id = 0 CREATE (a)-[author_article_0:AuthorArticle]->(b);
MATCH (a:Author), (b:Article) WHERE a.id = 0 AND b.id = 3 CREATE (a)-[author_article_1:AuthorArticle]->(b);
MATCH (a:Author), (b:Article) WHERE a.id = 0 AND b.id = 2 CREATE (a)-[author_article_2:AuthorArticle]->(b);
MATCH (a:Author), (b:Article) WHERE a.id = 1 AND b.id = 1 CREATE (a)-[author_article_3:AuthorArticle]->(b);
MATCH (a:Author), (b:Article) WHERE a.id = 1 AND b.id = 2 CREATE (a)-[author_article_4:AuthorArticle]->(b);
MATCH (a:Author), (b:Article) WHERE a.id = 1 AND b.id = 3 CREATE (a)-[author_article_5:AuthorArticle]->(b);
MATCH (a:Author), (b:Article) WHERE a.id = 1 AND b.id = 4 CREATE (a)-[author_article_6:AuthorArticle]->(b);
MATCH (a:Author), (b:Article) WHERE a.id = 2 AND b.id = 4 CREATE (a)-[author_article_7:AuthorArticle]->(b);
MATCH (a:Author), (b:Article) WHERE a.id = 3 AND b.id = 5 CREATE (a)-[author_article_8:AuthorArticle]->(b);
MATCH (a:Author), (b:Article) WHERE a.id = 3 AND b.id = 6 CREATE (a)-[author_article_9:AuthorArticle]->(b);
MATCH (a:Author), (b:Article) WHERE a.id = 3 AND b.id = 2 CREATE (a)-[author_article_10:AuthorArticle]->(b);
MATCH (a:Author), (b:Article) WHERE a.id = 3 AND b.id = 7 CREATE (a)-[author_article_11:AuthorArticle]->(b);

MATCH (a:Author), (b:Country) WHERE a.id = 0 AND b.id = 2 CREATE (a)<-[author_country_0:AuthorCountry]-(b);
MATCH (a:Author), (b:Country) WHERE a.id = 1 AND b.id = 2 CREATE (a)<-[author_country_1:AuthorCountry]-(b);
MATCH (a:Author), (b:Country) WHERE a.id = 2 AND b.id = 1 CREATE (a)<-[author_country_2:AuthorCountry]-(b);
MATCH (a:Author), (b:Country) WHERE a.id = 3 AND b.id = 0 CREATE (a)<-[author_country_3:AuthorCountry]-(b);

MATCH (a:Author), (b:Topic) WHERE a.id = 1 AND b.id = 0 CREATE (a)<-[author_topic_0:AuthorTopic { n_pubs : 3 }]-(b);
MATCH (a:Author), (b:Topic) WHERE a.id = 1 AND b.id = 2 CREATE (a)<-[author_topic_1:AuthorTopic { n_pubs : 1 }]-(b);
MATCH (a:Author), (b:Topic) WHERE a.id = 0 AND b.id = 0 CREATE (a)<-[author_topic_2:AuthorTopic { n_pubs : 2 }]-(b);
MATCH (a:Author), (b:Topic) WHERE a.id = 2 AND b.id = 0 CREATE (a)<-[author_topic_3:AuthorTopic { n_pubs : 1 }]-(b);
MATCH (a:Author), (b:Topic) WHERE a.id = 3 AND b.id = 2 CREATE (a)<-[author_topic_4:AuthorTopic { n_pubs : 2 }]-(b);
MATCH (a:Author), (b:Topic) WHERE a.id = 0 AND b.id = 2 CREATE (a)<-[author_topic_5:AuthorTopic { n_pubs : 2 }]-(b);
MATCH (a:Author), (b:Topic) WHERE a.id = 3 AND b.id = 0 CREATE (a)<-[author_topic_6:AuthorTopic { n_pubs : 3 }]-(b);

MATCH (a:Article), (b:Article) WHERE a.id = 0 AND b.id = 2 CREATE (a)<-[cited_by_0:CitedBy]-(b);
MATCH (a:Article), (b:Article) WHERE a.id = 0 AND b.id = 3 CREATE (a)<-[cited_by_1:CitedBy]-(b);
MATCH (a:Article), (b:Article) WHERE a.id = 0 AND b.id = 4 CREATE (a)<-[cited_by_2:CitedBy]-(b);
MATCH (a:Article), (b:Article) WHERE a.id = 0 AND b.id = 7 CREATE (a)<-[cited_by_3:CitedBy]-(b);
MATCH (a:Article), (b:Article) WHERE a.id = 1 AND b.id = 2 CREATE (a)<-[cited_by_4:CitedBy]-(b);
MATCH (a:Article), (b:Article) WHERE a.id = 1 AND b.id = 4 CREATE (a)<-[cited_by_5:CitedBy]-(b);
MATCH (a:Article), (b:Article) WHERE a.id = 2 AND b.id = 5 CREATE (a)<-[cited_by_6:CitedBy]-(b);
MATCH (a:Article), (b:Article) WHERE a.id = 3 AND b.id = 6 CREATE (a)<-[cited_by_7:CitedBy]-(b);
MATCH (a:Article), (b:Article) WHERE a.id = 6 AND b.id = 7 CREATE (a)<-[cited_by_8:CitedBy]-(b);

MATCH (a:Author), (b:Author) WHERE a.id = 0 AND b.id = 1 CREATE (a)-[coauthor_0:Coauthor { n_colab : 2 }]->(b);
MATCH (a:Author), (b:Author) WHERE a.id = 0 AND b.id = 3 CREATE (a)-[coauthor_1:Coauthor { n_colab : 1 }]->(b);
MATCH (a:Author), (b:Author) WHERE a.id = 1 AND b.id = 2 CREATE (a)-[coauthor_2:Coauthor { n_colab : 1 }]->(b);
MATCH (a:Author), (b:Author) WHERE a.id = 1 AND b.id = 3 CREATE (a)-[coauthor_3:Coauthor { n_colab : 1 }]->(b);

MATCH (a:Institute), (b:Country) WHERE a.id = 0 AND b.id = 0 CREATE (a)<-[institute_country_0:InstituteCountry]-(b);
MATCH (a:Institute), (b:Country) WHERE a.id = 1 AND b.id = 1 CREATE (a)<-[institute_country_1:InstituteCountry]-(b);
MATCH (a:Institute), (b:Country) WHERE a.id = 2 AND b.id = 2 CREATE (a)<-[institute_country_2:InstituteCountry]-(b);

MATCH (a:Institute), (b:Author) WHERE a.id = 2 AND b.id = 0 CREATE (a)-[institute_member_0:InstituteMember]->(b);
MATCH (a:Institute), (b:Author) WHERE a.id = 2 AND b.id = 1 CREATE (a)-[institute_member_1:InstituteMember]->(b);
MATCH (a:Institute), (b:Author) WHERE a.id = 1 AND b.id = 2 CREATE (a)-[institute_member_2:InstituteMember]->(b);
MATCH (a:Institute), (b:Author) WHERE a.id = 0 AND b.id = 3 CREATE (a)-[institute_member_3:InstituteMember]->(b);

MATCH (a:Venue), (b:Topic) WHERE a.id = 0 AND b.id = 0 CREATE (a)<-[venue_topic_0:VenueTopic]-(b);
MATCH (a:Venue), (b:Topic) WHERE a.id = 1 AND b.id = 1 CREATE (a)<-[venue_topic_1:VenueTopic]-(b);
MATCH (a:Venue), (b:Topic) WHERE a.id = 1 AND b.id = 2 CREATE (a)<-[venue_topic_2:VenueTopic]-(b);
MATCH (a:Venue), (b:Topic) WHERE a.id = 2 AND b.id = 1 CREATE (a)<-[venue_topic_3:VenueTopic]-(b);
MATCH (a:Venue), (b:Topic) WHERE a.id = 2 AND b.id = 2 CREATE (a)<-[venue_topic_4:VenueTopic]-(b);

