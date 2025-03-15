import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from "react-native";
import { AttributeGroup } from "@/models/AttributeGroup";
import { Ionicons } from "@expo/vector-icons";


interface FilterProps {
  attributeGroups: AttributeGroup[];
  selectedAttributes: string[];
  onSelectAttribute: (attribute: string) => void;
}

const Filter: React.FC<FilterProps> = ({ attributeGroups, selectedAttributes, onSelectAttribute }) => {
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const [filterVisible, setFilterVisible] = useState<boolean>(true);
  const animatedHeight = new Animated.Value(1);

  const toggleFilterVisibility = () => {
    setFilterVisible(!filterVisible);
    Animated.timing(animatedHeight, {
      toValue: filterVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const getSelectedCount = (groupId: number) => {
    const group = attributeGroups.find(g => g.id === groupId);
    if (!group) return 0;
    
    return group.attributes.filter(attr => 
      selectedAttributes.includes(attr.name)
    ).length;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.filterToggle}
        onPress={toggleFilterVisibility}
      >
        <View style={styles.filterHeader}>
          <View style={styles.filterTitle}>
            <Ionicons name="options-outline" size={18} color="#333" />
            <Text style={styles.filterTitleText}>Bộ lọc</Text>
          </View>
          <View style={styles.filterInfo}>
            {selectedAttributes.length > 0 && (
              <View style={styles.selectedCount}>
                <Text style={styles.selectedCountText}>{selectedAttributes.length}</Text>
              </View>
            )}
            <Ionicons 
              name={filterVisible ? "chevron-up" : "chevron-down"} 
              size={18} 
              color="#333" 
            />
          </View>
        </View>
      </TouchableOpacity>

      {selectedAttributes.length > 0 && (
        <View style={styles.selectedFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedAttributes.map((attr) => (
              <TouchableOpacity 
                key={attr} 
                style={styles.selectedChip}
                onPress={() => onSelectAttribute(attr)}
              >
                <Text style={styles.selectedChipText}>{attr}</Text>
                <Ionicons name="close-circle" size={16} color="#fff" />
              </TouchableOpacity>
            ))}
          </ScrollView>
          {selectedAttributes.length > 1 && (
            <TouchableOpacity 
              style={styles.clearAll}
              onPress={() => selectedAttributes.forEach(attr => onSelectAttribute(attr))}
            >
              <Text style={styles.clearAllText}>Xóa tất cả</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Animated.View style={[
        styles.filterContent,
        { 
          maxHeight: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000]
          }),
          opacity: animatedHeight
        }
      ]}>
        {filterVisible && attributeGroups.map((group) => (
          <View key={group.id} style={styles.groupContainer}>
            <TouchableOpacity 
              style={styles.groupHeader} 
              onPress={() => toggleGroup(group.id)}
            >
              <View style={styles.groupHeaderLeft}>
                <Ionicons
                  name={expandedGroups.includes(group.id) ? "chevron-down" : "chevron-forward"}
                  size={18}
                  color="#333"
                />
                <Text style={styles.groupTitle}>{group.name}</Text>
              </View>
              
              {getSelectedCount(group.id) > 0 && (
                <View style={styles.groupSelectedCount}>
                  <Text style={styles.groupSelectedCountText}>
                    {getSelectedCount(group.id)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            {expandedGroups.includes(group.id) && (
              <View style={styles.attributeContainer}>
                {group.attributes.map((attribute) => {
                  const isSelected = selectedAttributes.includes(attribute.name);
                  return (
                    <TouchableOpacity
                      key={attribute.id}
                      style={[styles.attributeItem, isSelected && styles.selectedItem]}
                      onPress={() => onSelectAttribute(attribute.name)}
                    >
                      <Text style={[styles.attributeText, isSelected && styles.selectedText]}>
                        {attribute.name}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="#fff" style={styles.checkIcon} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterToggle: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterTitleText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  filterInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedCount: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  selectedCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 6,
  },
  filterContent: {
    overflow: "hidden",
  },
  selectedFilters: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingBottom: 12,
    alignItems: "center",
  },
  selectedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  selectedChipText: {
    color: "#fff",
    marginRight: 4,
    fontSize: 14,
  },
  clearAll: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearAllText: {
    color: "#666",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  groupContainer: {
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  groupHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupTitle: {
    fontSize: 15,
    marginLeft: 8,
    color: "#333",
    fontWeight: "500",
  },
  groupSelectedCount: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  groupSelectedCountText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 6,
  },
  attributeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 10,
    paddingBottom: 5,
  },
  attributeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedItem: {
    backgroundColor: "#4CAF50",
  },
  attributeText: {
    fontSize: 14,
    color: "#333",
  },
  selectedText: {
    color: "#fff",
  },
  checkIcon: {
    marginLeft: 4,
  },
});

export default Filter;