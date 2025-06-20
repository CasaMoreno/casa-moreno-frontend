import styled from 'styled-components';

const FilterContainer = styled.aside`
  flex: 1;
  max-width: 200px;
  margin-right: 2rem;
  padding-right: 2rem;
  border-right: 1px solid #ddd;
  align-self: flex-start;

  h3 {
    margin-bottom: 2rem; 
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    max-width: 100%;
    width: 100%;
    margin-right: 0;
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid #ddd;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
  
  h4 {
    margin-bottom: 0.75rem;
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

const PriceFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PriceInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ProductFilter = ({
  brands,
  selectedBrands,
  onBrandChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  selectedConditions,
  onConditionChange
}) => {
  const conditions = ["Novo", "Usado"];

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
              checked={selectedBrands.includes(brand)}
              onChange={() => onBrandChange(brand)}
            />
            <label htmlFor={brand}>{brand}</label>
          </CheckboxContainer>
        ))}
      </FilterGroup>

      <FilterGroup>
        <h4>Condição</h4>
        {conditions.map(condition => (
          <CheckboxContainer key={condition}>
            <input
              type="checkbox"
              id={condition}
              name={condition}
              checked={selectedConditions.includes(condition)}
              onChange={() => onConditionChange(condition)}
            />
            <label htmlFor={condition}>{condition}</label>
          </CheckboxContainer>
        ))}
      </FilterGroup>

      <FilterGroup>
        <h4>Preço</h4>
        <PriceFilterContainer>
          <PriceInput
            type="number"
            placeholder="Mín."
            value={minPrice}
            onChange={onMinPriceChange}
          />
          <span>-</span>
          <PriceInput
            type="number"
            placeholder="Máx."
            value={maxPrice}
            onChange={onMaxPriceChange}
          />
        </PriceFilterContainer>
      </FilterGroup>

    </FilterContainer>
  );
}

export default ProductFilter;