// src/components/product/ProductFilter.js (VERSÃO ATUALIZADA)

import styled from 'styled-components';

const FilterContainer = styled.aside`
  flex: 1;
  max-width: 200px;
  margin-right: 2rem;
  padding-right: 2rem;
  border-right: 1px solid #ddd;
  align-self: flex-start;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
  
  h4 {
    margin-bottom: 0.5rem;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;

  label {
    margin-left: 0.5rem;
    cursor: pointer;
  }
`;

// O componente agora recebe props para ser interativo
const ProductFilter = ({ brands, selectedBrands, onBrandChange }) => {
  return (
    <FilterContainer>
      <h3>Filtros</h3>
      <FilterGroup>
        <h4>Marca</h4>
        {brands.map(brand => (
          <CheckboxContainer key={brand}>
            <input
              type="checkbox"
              id={brand}
              name={brand}
              // Verifica se a marca está na lista de selecionadas
              checked={selectedBrands.includes(brand)}
              // Chama a função para lidar com a mudança quando clicado
              onChange={() => onBrandChange(brand)}
            />
            <label htmlFor={brand}>{brand}</label>
          </CheckboxContainer>
        ))}
      </FilterGroup>
    </FilterContainer>
  );
}

export default ProductFilter;