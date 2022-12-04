import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MultiSelect from 'react-native-multiple-select';

const CustomMutipleSelect = ({ title = 'testing', single = false, placeholder = 'Pick Item', arr = [], selectedItems, onSelectedItemsChange = () => {} }) => {
  return (
    <View style={{ width: '95%', marginBottom: 20, borderBottomWidth: 0, borderRadius: 5, backgroundColor: '#F1F1F1', paddingHorizontal: 10 }}>
      <MultiSelect
        hideTags
        items={arr}
        uniqueKey='id'
        fontSize={18}
        styleMainWrapper={{ justifyContent: 'center' }}
        styleTextDropdown={{ height: '100%', justifyContent: 'center', marginTop: 10 }}
        styleTextDropdownSelected={{ height: '100%', justifyContent: 'center', marginTop: 10 }}
        styleDropdownMenuSubsection={{ backgroundColor: 'transparent', borderBottomWidth: 0, justifyContent: 'center' }}
        styleListContainer={{ marginTop: 10 }}
        styleItemsContainer={{ backgroundColor: '#F1F1F1' }}
        onSelectedItemsChange={onSelectedItemsChange}
        searchInputPlaceholderText=''
        selectedItems={selectedItems}
        selectText={placeholder}
        selectedItemTextColor='grey'
        selectedItemIconColor='grey'
        itemTextColor='#000'
        displayKey='name'
        searchIcon={() => null}
        searchInputStyle={{ color: '#000' }}
        submitButtonColor='grey'
        submitButtonText={`Confirm ${placeholder}`}
        single={single}
        styleInputGroup={{ backgroundColor: '#F1F1F1', height: 0, display: 'none' }}
        canAddItems={false}
        onChangeInput={() => {}}
        editable={false}
        showSoftInputOnFocus={false}
        flatListProps={{ keyboardShouldPersistTaps: 'never' }}
        textInputProps={{ keyboardShouldPersistTaps: 'never', editable: false }}
        hideSearch={true}
        autoFocus={false}
      />
    </View>
  );
};

export default CustomMutipleSelect;

const styles = StyleSheet.create({});

// import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
// import React from 'react';
// import MultiSelect from 'react-native-multiple-select';
// import SectionedMultiSelect from 'react-native-sectioned-multi-select';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const CustomMutipleSelect = ({ title = 'testing', single = false, placeholder = 'Pick Item', arr = [], selectedItems, onSelectedItemsChange = () => {} }) => {
//   return (
//     <View style={{ width: '95%', marginBottom: 20, borderBottomWidth: 0, borderRadius: 5, backgroundColor: '#F1F1F1', paddingHorizontal: 10, height: 60 }}>
//       <SectionedMultiSelect
//         items={arr}
//         uniqueKey='id'
//         styles={styles}
//         IconRenderer={Icon}
//         showDropDowns={true}
//         showChips={false}
//         onSelectedItemsChange={onSelectedItemsChange}
//         selectedItems={selectedItems}
//         hideSearch
//         single={single}
//         headerComponent={() => <Text>{placeholder}</Text>}
//         fontSize={18}
//       />
//     </View>
//   );
// };

// export default CustomMutipleSelect;

// const styles = StyleSheet.create({
//   selectedItem: {
//     color: 'red',
//   },
// });
