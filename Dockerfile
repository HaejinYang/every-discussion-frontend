FROM node:lts-alpine as build-stage
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

FROM php:8.2-apache as production-stage
COPY --from=build-stage /app/dist /var/www/html/public

RUN a2enmod rewrite && a2enmod ssl && a2enmod socache_shmcb

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# ssl 변경
RUN sed -i '/SSLCertificateFile.*snakeoil\.pem/c\SSLCertificateFile /etc/letsencrypt/live/www.every-discussion.com/fullchain.pem' /etc/apache2/sites-available/default-ssl.conf
RUN sed -i '/SSLCertificateKeyFile.*snakeoil\.key/c\SSLCertificateKeyFile /etc/letsencrypt/live/www.every-discussion.com/privkey.pem' /etc/apache2/sites-available/default-ssl.conf

RUN a2ensite default-ssl

WORKDIR /var/www/html/public
