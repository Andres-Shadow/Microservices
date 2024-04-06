package utilities

func GetAllLogs(page, pageSize int) []int {
	arr := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

	return arr[page:pageSize]
}

func CountAllLogs() int {
	return 10
}
