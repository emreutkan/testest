import React, { useCallback, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const App = () => {
    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);
    // const [buttonpressed, ]
    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    // renders
    return (
        <GestureHandlerRootView style={styles.container}>
            <BottomSheet
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
                enablePanDownToClose={true}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text>Awesome 🎉</Text>
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        padding: 136,
        alignItems: 'center',
    },
});

export default App;