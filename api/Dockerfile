FROM node:18-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia código da aplicação
COPY . .

# Expõe porta
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "run", "dev"]
