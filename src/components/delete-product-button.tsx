import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Modal, Alert, Platform } from 'react-native';
import { DeleteIcon } from './tab-icons';
import { useAppTheme } from '@/theme/theme-context';

const DARK_C = {
  modalBg: '#1a1a1a',
  modalBorder: '#333333',
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  cancelBg: '#333333',
  toastCard: '#151515',
};

const LIGHT_C = {
  modalBg: '#ffffff',
  modalBorder: '#e2e2e6',
  textPrimary: '#111111',
  textSecondary: '#5c5c66',
  cancelBg: '#eef0f3',
  toastCard: '#ffffff',
};

type Palette = typeof DARK_C;

interface DeleteProductButtonProps {
  onDelete: () => Promise<void> | void;
}

export default function DeleteProductButton({ onDelete }: DeleteProductButtonProps) {
  const { mode } = useAppTheme();
  const styles = mode === "dark" ? stylesByMode.dark : stylesByMode.light;

  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      // Show success toast after delete
      setShowConfirm(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    } catch (e: any) {
      console.error(e);
      setShowConfirm(false);
      const message = e?.message || "Failed to delete product from the database.";
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert("Delete Failed", message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => setShowConfirm(true)}
        activeOpacity={0.8}
      >
        <DeleteIcon color="#ff4655" size={12} />
        <Text style={styles.deleteBtnText}>Delete</Text>
      </TouchableOpacity>

      {/* ── Confirm Dialog ── */}
      {showConfirm && (
        <Modal transparent={true} animationType="fade" visible={showConfirm}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Delete Product?</Text>
              <Text style={styles.modalText}>Are you sure you want to delete this product? This action cannot be undone.</Text>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowConfirm(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} disabled={isDeleting}>
                  <Text style={styles.confirmText}>{isDeleting ? 'Deleting...' : 'Delete'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* ── Success Toast ── */}
      <Modal transparent visible={showSuccess} animationType="fade">
        <View style={styles.toastOverlay}>
          <View style={styles.toastCard}>
            <View style={styles.toastCheckCircle}>
              <Text style={styles.toastCheckIcon}>✓</Text>
            </View>
            <Text style={styles.toastTitle}>Deleted!</Text>
            <Text style={styles.toastMsg}>Product deleted successfully!</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const buildStyles = (C: Palette) => StyleSheet.create({
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 70, 85, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ff4655',
    marginBottom: 4,
    gap: 4,
  },
  deleteBtnText: {
    color: '#ff4655',
    fontSize: 10,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: C.modalBg,
    borderWidth: 1,
    borderColor: C.modalBorder,
    borderRadius: 12,
    padding: 24,
    width: 320,
    alignItems: 'center',
  },
  modalTitle: {
    color: C.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalText: {
    color: C.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: C.cancelBg,
    alignItems: 'center',
  },
  cancelText: {
    color: C.textPrimary,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#ff4655',
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Toast Success Overlay
  toastOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastCard: {
    backgroundColor: C.toastCard,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#22c55e',
    paddingVertical: 36,
    paddingHorizontal: 40,
    alignItems: 'center',
    minWidth: 240,
    maxWidth: 320,
  },
  toastCheckCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#052e16',
    borderWidth: 3,
    borderColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  toastCheckIcon: {
    fontSize: 36,
    color: '#22c55e',
    fontWeight: '900',
  },
  toastTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.textPrimary,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  toastMsg: {
    fontSize: 15,
    color: '#22c55e',
    fontWeight: '600',
    textAlign: 'center',
  },
});

const stylesByMode = { dark: buildStyles(DARK_C), light: buildStyles(LIGHT_C) };
