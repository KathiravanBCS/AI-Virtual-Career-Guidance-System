import React, { useState, useMemo, useCallback } from 'react';
import { Select, MultiSelect, Badge, Group, Text } from '@mantine/core';
import type { SelectProps, MultiSelectProps } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { useUncontrolled } from '@mantine/hooks';
import { useGetAllPermissions } from '@/features/master/masterPermissions/api/useGetAllPermissions';
import type { Permission } from '@/features/master/masterPermissions/types';

interface BasePermissionPickerProps {
  excludeInactive?: boolean;
  excludeIds?: number[];
}

interface SinglePermissionPickerProps extends BasePermissionPickerProps, Omit<SelectProps, 'data' | 'value' | 'onChange' | 'defaultValue'> {
  multiple?: false;
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
}

interface MultiPermissionPickerProps extends BasePermissionPickerProps, Omit<MultiSelectProps, 'data' | 'value' | 'onChange' | 'defaultValue'> {
  multiple: true;
  value?: number[];
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
}

type PermissionPickerProps = SinglePermissionPickerProps | MultiPermissionPickerProps;

interface PermissionOption {
  value: string;
  label: string;
  permission: Permission;
}

export function PermissionPicker(props: PermissionPickerProps) {
  const {
    multiple = false,
    value,
    defaultValue,
    onChange,
    excludeInactive = true,
    excludeIds = [],
    label = multiple ? 'Permissions' : 'Permission',
    placeholder = multiple ? 'Select permissions...' : 'Select permission...',
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

  // Fetch permissions from API
  const { data: dbPermissions = [], isLoading } = useGetAllPermissions();

  // Filter permissions based on props
  const filterPermissions = useCallback((permissions: Permission[]) => {
    return permissions.filter(permission => {
      // Filter by active status
      if (excludeInactive && !permission.is_active) {
        return false;
      }

      // Exclude specific IDs
      if (excludeIds.includes(permission.id)) return false;

      return true;
    });
  }, [excludeInactive, excludeIds]);

  // Filter and prepare permission options
  const permissionOptions = useMemo((): PermissionOption[] => {
    // Filter permissions based on props
    const filteredPermissions = filterPermissions(dbPermissions);

    // Convert to options format
    const options = filteredPermissions.map(permission => ({
      value: String(permission.id),
      label: permission.action,
      permission: permission,
    }));

    // Filter by search value
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      return options.filter(opt => {
        return (
          opt.permission.action.toLowerCase().includes(searchLower) ||
          opt.permission.description.toLowerCase().includes(searchLower)
        );
      });
    }

    return options;
  }, [dbPermissions, filterPermissions, searchValue]);

  // Custom render option for Mantine v8
  const renderOption: SelectProps['renderOption'] = ({ option }) => {
    const permissionOption = permissionOptions.find(p => p.value === option.value);
    if (!permissionOption) return <Text size="sm">{option.label}</Text>;

    const { permission } = permissionOption;

    return (
      <Group wrap="nowrap">
        <IconLock size={16} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <Text size="sm">{permission.action}</Text>
          <Text size="xs" c="dimmed">
            {permission.description}
          </Text>
        </div>
        {permission.is_active && (
          <Badge size="xs" variant="light" color="green">
            Active
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
  const selectData = permissionOptions.map(opt => ({
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
        leftSection={<IconLock size={16} />}
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
      leftSection={<IconLock size={16} />}
      style={{ userSelect: 'text' }}
      inputWrapperOrder={['label', 'error', 'input', 'description']}
      {...(restProps as SelectProps)}
    />
  );
}
