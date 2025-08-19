import api from "../api/api";
import { ProductDTO } from "../types";

export const productService = {
  // Lista todos os produtos
  listAll: async (): Promise<ProductDTO[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  // Busca produto por ID
  findById: async (id: number): Promise<ProductDTO> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Cria novo produto
  create: async (product: ProductDTO): Promise<ProductDTO> => {
    const response = await api.post('/products', product);
    return response.data;
  },

  // Atualiza produto
  update: async (id: number, product: ProductDTO): Promise<ProductDTO> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  // Deleta produto
  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Filtra produtos por nome ou tipo
  filterProducts: async (
    name?: string,
    type?: string
  ): Promise<ProductDTO[]> => {
    const params: any = {};
    if (name) params.name = name;
    if (type) params.type = type;

    const response = await api.get('/products/filter', { params });
    return response.data;
  },

  // Lista tipos de produtos
  getTypes: async (): Promise<string[]> => {
    const response = await api.get('/products/types');
    return response.data;
  }
};