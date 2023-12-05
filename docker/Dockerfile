FROM php:8.2-apache

RUN apt-get update && \
    apt-get install -y \
    libzip-dev \
    zip \
    curl \
    libcurl4-openssl-dev

RUN a2enmod rewrite && a2enmod ssl && a2enmod socache_shmcb

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# change crt and key by mine
#RUN sed -i '/SSLCertificateFile.*snakeoil\.pem/c\SSLCertificateFile /etc/ssl/docker/local-docker.crt' /etc/apache2/sites-available/default-ssl.conf
#RUN sed -i '/SSLCertificateKeyFile.*snakeoil\.key/c\SSLCertificateKeyFile /etc/ssl/docker/local-docker.key' /etc/apache2/sites-available/default-ssl.conf
#RUN a2ensite default-ssl
WORKDIR /var/www/html/public