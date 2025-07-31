FROM node:24-alpine3.21 AS build

WORKDIR /app

# Install dependencies
COPY package*.json .
RUN npm install 

COPY . . 
RUN npm run build

FROM nginx:alpine

# Copy built files from previous step
COPY --from=build /app/dist /usr/share/nginx/html

# Remove default nginx config and add custom (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
