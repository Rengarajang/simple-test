FROM node:8.6-alpine
 
RUN mkdir -p /graduate
WORKDIR /graduate
 
COPY . .
RUN npm install
 
 
EXPOSE 3000
CMD ["npm", "start"]
