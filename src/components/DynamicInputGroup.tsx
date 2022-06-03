import clsx from "clsx";
import React, { ComponentType, ReactNode, useCallback } from "react";

import * as styles from "./DynamicInputGroup.module.scss";
import { Input } from "./Input";

interface DynamicInputGroupProps {
  onChange: (payload: (string | number)[]) => void;
  fields: (string | number)[];
  children: ReactNode;
  validator?: (value: string | number) => (string | ReactNode)[];
  fieldName: string;
  className?: string | undefined;
  required?: boolean | undefined;
}

export const DynamicInputGroup = ({
  onChange,
  fields,
  children,
  validator,
  fieldName,
  className,
  required,
}: DynamicInputGroupProps) => {
  const handleChange = (e) => {
    const { value } = e.target;
    // the name is the index
    const index = parseInt(e.target.name);
    if (!fields.length) {
      onChange([value]);
      return;
    }
    const updatedCodeLines = [...fields];
    updatedCodeLines[index] = value;
    onChange(updatedCodeLines);
  };

  const handleRemoveInputField = useCallback(
    // the name is the index
    (name: string): void => {
      const index = parseInt(name);
      const updatedCodeLines = fields.slice();
      updatedCodeLines.splice(index, 1);
      onChange(updatedCodeLines);
    },
    [fields, onChange]
  );

  const handleAddInputField = (): void => {
    onChange([...fields, ""]);
  };

  return (
    <div className={clsx(styles.DynamicInputGroup, className)}>
      {children}
      {fields.map((value, i) => (
        <Input
          key={`field-${fieldName}-${i}`}
          value={value}
          // name is set to index for the purpose of
          // removing/updating the right field in the array
          name={`${i}`}
          canRemove={required ? i > 0 : true}
          required={required && i === 0}
          handleChange={handleChange}
          handleRemoveInputField={handleRemoveInputField}
          validator={validator}
        />
      ))}
      <button
        className={styles.AddLineButton}
        type="button"
        onClick={handleAddInputField}
      >
        {`Add another ${fieldName}`}
      </button>
    </div>
  );
};