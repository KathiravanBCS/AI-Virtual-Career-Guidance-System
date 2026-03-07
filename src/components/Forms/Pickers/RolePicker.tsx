import React, { useState, useMemo, useCallback } from 'react';
import { Select, MultiSelect, Badge, Group, Text } from '@mantine/core';
import type { SelectProps, MultiSelectProps } from '@mantine/core';
import { IconShield } from '@tabler/icons-react';
import { useUncontrolled } from '@mantine/hooks';
import { useGetAllRoles } from '@/features/master/masterRoles/api/useGetAllRoles';
import type { Role } from '@/features/master/masterRoles/types';

interface BaseRolePickerProps {
  excludeInactive?: boolean;
  excludeIds?: number[];
}

interface SingleRolePickerProps extends BaseRolePickerProps, Omit<SelectProps, 'data' | 'value' | 'onChange' | 'defaultValue'> {
  multiple?: false;
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
}

interface MultiRolePickerProps extends BaseRolePickerProps, Omit<MultiSelectProps, 'data' | 'value' | 'onChange' | 'defaultValue'> {
  multiple: true;
  value?: number[];
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
}

type RolePickerProps = SingleRolePickerProps | MultiRolePickerProps;

interface RoleOption {
  value: string;
  label: string;
  role: Role;
}

export function RolePicker(props: RolePickerProps) {
  const {
    multiple = false,
    value,
    defaultValue,
    onChange,
    excludeInactive = true,
    excludeIds = [],
    label = multiple ? 'Roles' : 'Role',
    placeholder = multiple ? 'Select roles...' : 'Select role...',
    required = false,
    disabled = false,
    error,
    ...restProps
  } = props;

  // Use useUncontrolled to support both controlled and uncontrolled modes
  const [_value, handleValueChange] = useUncontrolled<number | number[] | null>({
    value: value,
    defaultValue: defaultValue,
    finalValue: multiple ? [] : null,
    onChange: onChange as any,
  });

  // State for search
  const [searchValue, setSearchValue] = useState('');

  // Fetch roles from API
  const { data: dbRoles = [], isLoading } = useGetAllRoles();

  // Filter roles based on props
  const filterRoles = useCallback((roles: Role[]) => {
    return roles.filter(role => {
      // Filter by active status
      if (excludeInactive && !role.is_active) {
        return false;
      }

      // Exclude specific IDs
      if (excludeIds.includes(role.id)) return false;

      return true;
    });
  }, [excludeInactive, excludeIds]);

  // Filter and prepare role options
  const roleOptions = useMemo((): RoleOption[] => {
    // Filter roles based on props
    const filteredRoles = filterRoles(dbRoles);

    // Convert to options format
    const options = filteredRoles.map(role => ({
      value: String(role.id),
      label: role.role_name,
      role: role,
    }));

    // Filter by search value
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      return options.filter(opt => {
        return (
          opt.role.role_name.toLowerCase().includes(searchLower) ||
          opt.role.description.toLowerCase().includes(searchLower)
        );
      });
    }

    return options;
  }, [dbRoles, filterRoles, searchValue]);

  // Custom render option for Mantine v8
  const renderOption: SelectProps['renderOption'] = ({ option }) => {
    const roleOption = roleOptions.find(r => r.value === option.value);
    if (!roleOption) return <Text size="sm">{option.label}</Text>;

    const { role } = roleOption;

    return (
      <Group wrap="nowrap">
        <IconShield size={16} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <Text size="sm">{role.role_name}</Text>
          <Text size="xs" c="dimmed">
            {role.description}
          </Text>
        </div>
        {role.is_system_role && (
          <Badge size="xs" variant="light">
            System
          </Badge>
        )}
      </Group>
    );
  };

  // Handle value changes
  const handleChange = useCallback(
    (selectedValues: string | string[] | null) => {
      if (multiple) {
        const values = selectedValues as string[];
        const selectedIds = values.map(val => Number(val));
        handleValueChange(selectedIds);
      } else {
        const val = selectedValues as string | null;
        handleValueChange(val ? Number(val) : null);
      }
    },
    [handleValueChange, multiple]
  );

  // Prepare data for Select/MultiSelect
  const selectData = roleOptions.map(opt => ({
    value: opt.value,
    label: opt.label,
  }));

  if (multiple) {
    return (
      <MultiSelect
        label={label}
        placeholder={placeholder}
        required={required}
        disabled={disabled || isLoading}
        error={error}
        data={selectData}
        value={(_value as number[] | undefined)?.map(v => String(v)) || []}
        onChange={handleChange}
        renderOption={renderOption}
        searchable
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        clearable
        maxDropdownHeight={280}
        leftSection={<IconShield size={16} />}
        style={{ userSelect: 'text' }}
        inputWrapperOrder={['label', 'error', 'input', 'description']}
        {...(restProps as MultiSelectProps)}
      />
    );
  }

  return (
    <Select
      label={label}
      placeholder={placeholder}
      required={required}
      disabled={disabled || isLoading}
      error={error}
      data={selectData}
      value={(_value as number | null | undefined) ? String(_value) : null}
      onChange={handleChange}
      renderOption={renderOption}
      searchable
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      clearable
      maxDropdownHeight={280}
      leftSection={<IconShield size={16} />}
      style={{ userSelect: 'text' }}
      inputWrapperOrder={['label', 'error', 'input', 'description']}
      {...(restProps as SelectProps)}
    />
  );
}
