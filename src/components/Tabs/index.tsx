import { useMemo, useState } from "react";
import { css, styled } from "styled-components";

const Container = styled.div`
  width: 100%;
  border-bottom: 1px solid #c9c9c9;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Item = styled.div<{ $active?: boolean }>`
  color: #333;
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  padding: 10px;
  ${(props) =>
    props.$active &&
    css`
      font-weight: 700;
      border-bottom: 2px solid #333333;
    `}
`;

const Tabs = ({
  options = [],
}: {
  options: { key: string; label: string; component: any }[];
}) => {
  const [tab, setTab] = useState(options?.[0]?.key || "");
  const option = useMemo(() => {
return options.find(i => i.key === tab)
  }, [options, tab])
  return (
    <>
      <Container>
        {options.map((i) => {
          return (
            <Item
              key={i.key}
              $active={tab === i.key}
              onClick={() => setTab(i.key)}
            >
              {i.label}
            </Item>
          );
        })}
      </Container>
      {option && option.component}
    </>
  );
};

export default Tabs;
