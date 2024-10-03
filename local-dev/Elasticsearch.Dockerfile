FROM docker.elastic.co/elasticsearch/elasticsearch:8.15.0

WORKDIR /usr/share/elasticsearch/bin

RUN ./elasticsearch-plugin install analysis-icu
RUN ./elasticsearch-plugin install analysis-kuromoji
RUN ./elasticsearch-plugin install analysis-smartcn
RUN ./elasticsearch-plugin install analysis-stempel
