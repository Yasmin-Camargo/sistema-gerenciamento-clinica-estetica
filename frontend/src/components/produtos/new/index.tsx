import React, { useState, useEffect } from 'react';
import { StandardPage } from '../../listPadrao';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { ProductDTO } from '../../../types';

export interface ProductFormData {
  name: string;
  description?: string;
  type?: string;
}

export const NewProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    type: '',
  });

  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await productService.getTypes(); 
        setTypes(response);
      } catch (error) {
        console.error('Erro ao buscar tipos de produto:', error);
      }
    };
    fetchTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productService.create(formData as ProductDTO);
      alert('Produto cadastrado com sucesso!');
      navigate('/products');
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      alert('Erro ao cadastrar produto. Verifique os dados e tente novamente.');
    }
  };

  return (
    <StandardPage title="Novo Produto">
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Nome*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome do produto"
            required
          />
        </div>

        <div className="field">
          <label>Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrição do produto"
          />
        </div>

        <div className="field">
          <label>Tipo</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            {types.length === 0 ? (
              <option value="">Nenhum</option>
            ) : (
              <>
                <option value="">Selecione um tipo</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </>
            )}
          </select>
        </div>

        <div className="actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit">
            Salvar
          </button>
        </div>
      </form>
    </StandardPage>
  );
};
