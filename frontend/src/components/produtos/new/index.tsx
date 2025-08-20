import React, { useState } from 'react';
import { StandardPage } from '../../listPadrao';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { ProductDTO } from '../../../types';
import { notifyError, notifySuccess } from '../../../utils/errorUtils';

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

  // Campo 'type' é texto livre; sem carregamento de tipos

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
      notifySuccess('Produto cadastrado com sucesso!');
      navigate('/products');
    } catch (error) {
      notifyError(error, 'Erro ao cadastrar produto. Verifique os dados e tente novamente.');
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
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Tipo do produto"
          />
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
