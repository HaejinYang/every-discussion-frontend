FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

FROM php:8.2-apache as production-stage
COPY --from=build-stage /app/dist /var/www/html/public

RUN a2enmod rewrite
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
WORKDIR /var/www/html/public
