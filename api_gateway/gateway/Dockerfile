FROM ruby:latest

WORKDIR /app

COPY . .

RUN gem install webrick

CMD [ "ruby", "server.rb" ]